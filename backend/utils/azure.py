import openai
import requests
import json
from quart import jsonify, Response, Request
from backend.settings import app_settings
from backend.utils.data import format_as_ndjson

def fetchUserGroups(userToken, nextLink=None):
    # Recursively fetch group membership
    if nextLink:
        endpoint = nextLink
    else:
        endpoint = "https://graph.microsoft.com/v1.0/me/transitiveMemberOf?$select=id"
    
    headers = {
        'Authorization': "bearer " + userToken
    }
    try :
        r = requests.get(endpoint, headers=headers)
        if r.status_code != 200:
            return []
        
        r = r.json()
        if "@odata.nextLink" in r:
            nextLinkData = fetchUserGroups(userToken, r["@odata.nextLink"])
            r['value'].extend(nextLinkData)
        
        return r['value']
    except Exception as e:
        return []


def generateFilterString(userToken):
    # Get list of groups user is a member of
    userGroups = fetchUserGroups(userToken)

    # Construct filter string
    if userGroups:
        group_ids = ", ".join([obj['id'] for obj in userGroups])
        return f"{app_settings.search.permitted_groups_column}/any(g:search.in(g, '{group_ids}'))"
    
    return None


async def prepare_body_headers_with_data(request: Request):
    request_json = await request.get_json()
    request_messages = request_json["messages"]

    # Set query type
    query_type = "simple"
    if app_settings.search.query_type:
        query_type = app_settings.search.query_type
    elif app_settings.search.use_semantic_search.lower() == "true" and app_settings.search.semantic_search_config:
        query_type = "semantic"

    # Set filter
    filter = None
    userToken = None
    if app_settings.search.permitted_groups_column:
        userToken = request.headers.get('X-MS-TOKEN-AAD-ACCESS-TOKEN', "")
        filter = generateFilterString(userToken)

    body = {
        "messages": request_messages,
        "temperature": float(app_settings.openai.temperature),
        "max_tokens": int(app_settings.openai.max_tokens),
        "top_p": float(app_settings.openai.top_p),
        "stop": app_settings.openai.stop_sequence.split("|") if app_settings.openai.stop_sequence else None,
        "stream": app_settings.openai.should_stream,
        "dataSources": [
            {
                "type": "AzureCognitiveSearch",
                "parameters": {
                    "endpoint": f"https://{app_settings.search.service}.search.windows.net",
                    "key": app_settings.search.key,
                    "indexName": app_settings.search.index,
                    "fieldsMapping": {
                        "contentFields": app_settings.search.content_columns.split("|") if app_settings.search.content_columns else [],
                        "titleField": app_settings.search.title_column if app_settings.search.title_column else None,
                        "urlField": app_settings.search.url_column if app_settings.search.url_column else None,
                        "filepathField": app_settings.search.filename_column if app_settings.search.filename_column else None,
                        "vectorFields": app_settings.search.vector_columns.split("|") if app_settings.search.vector_columns else []
                    },
                    "inScope": True if app_settings.search.enable_in_domain.lower() == "true" else False,
                    "topNDocuments": app_settings.search.top_k,
                    "queryType": query_type,
                    "semanticConfiguration": app_settings.search.semantic_search_config if app_settings.search.semantic_search_config else "",
                    "roleInformation": app_settings.openai.system_message,
                    "embeddingEndpoint": app_settings.openai.embedding_endpoint,
                    "embeddingKey": app_settings.openai.embedding_key,
                    "filter": filter
                }
            }
        ]
    }

    headers = {
        'Content-Type': 'application/json',
        'api-key': app_settings.openai.key,
        "x-ms-useragent": "GitHubSampleWebApp/PublicAPI/2.0.0"
    }

    return body, headers


def stream_with_data(body, headers, endpoint):
    s = requests.Session()
    response = {
        "id": "",
        "model": "",
        "created": 0,
        "object": "",
        "choices": [{
            "messages": []
        }]
    }
    try:
        with s.post(endpoint, json=body, headers=headers, stream=True) as r:
            for line in r.iter_lines(chunk_size=10):
                if line:
                    lineJson = json.loads(line.lstrip(b'data:').decode('utf-8'))
                    if 'error' in lineJson:
                        yield format_as_ndjson(lineJson)
                    response["id"] = lineJson["id"]
                    response["model"] = lineJson["model"]
                    response["created"] = lineJson["created"]
                    response["object"] = lineJson["object"]

                    role = lineJson["choices"][0]["messages"][0]["delta"].get("role")
                    if role == "tool":
                        response["choices"][0]["messages"].append(lineJson["choices"][0]["messages"][0]["delta"])
                    elif role == "assistant": 
                        response["choices"][0]["messages"].append({
                            "role": "assistant",
                            "content": ""
                        })
                    else:
                        deltaText = lineJson["choices"][0]["messages"][0]["delta"]["content"]
                        if deltaText != "[DONE]":
                            response["choices"][0]["messages"][1]["content"] += deltaText

                    yield format_as_ndjson(response)
    except Exception as e:
        yield format_as_ndjson({"error": str(e)})

async def conversation_with_data(request: Request):
    body, headers = await prepare_body_headers_with_data(request)
    base_url = app_settings.openai.endpoint if app_settings.openai.endpoint else f"https://{app_settings.openai.resource}.openai.azure.com/"
    endpoint = f"{base_url}openai/deployments/{app_settings.openai.model}/extensions/chat/completions?api-version={app_settings.openai.preview_api_version}"
    
    if not app_settings.openai.should_stream:
        r = requests.post(endpoint, headers=headers, json=body)
        status_code = r.status_code
        r = r.json()

        return Response(format_as_ndjson(r), status=status_code)
    else:
        return Response(stream_with_data(body, headers, endpoint))

def stream_without_data(response):
    responseText = ""
    for line in response:
        deltaText = line["choices"][0]["delta"].get('content')
        if deltaText and deltaText != "[DONE]":
            responseText += deltaText

        response_obj = {
            "id": line["id"],
            "model": line["model"],
            "created": line["created"],
            "object": line["object"],
            "choices": [{
                "messages": [{
                    "role": "assistant",
                    "content": responseText
                }]
            }]
        }
        yield format_as_ndjson(response_obj)


async def conversation_without_data(request: Request):
    openai.api_type = "azure"
    openai.api_base = app_settings.openai.endpoint if app_settings.openai.endpoint else f"https://{app_settings.openai.resource}.openai.azure.com/"
    openai.api_version = "2023-03-15-preview"
    openai.api_key = app_settings.openai.key

    request_json = await request.get_json()
    request_messages = request_json["messages"]

    messages = [
        {
            "role": "system",
            "content": app_settings.openai.system_message
        }
    ]

    for message in request_messages:
        messages.append({
            "role": message["role"] ,
            "content": message["content"]
        })

    response = openai.ChatCompletion.create(
        engine=app_settings.openai.model,
        messages = messages,
        temperature=float(app_settings.openai.temperature),
        max_tokens=int(app_settings.openai.max_tokens),
        top_p=float(app_settings.openai.top_p),
        stop=app_settings.openai.stop_sequence.split("|") if app_settings.openai.stop_sequence else None,
        stream=app_settings.openai.should_stream
    )

    if not app_settings.openai.should_stream:
        response_obj = {
            "id": response,
            "model": response.model,
            "created": response.created,
            "object": response.object,
            "choices": [{
                "messages": [{
                    "role": "assistant",
                    "content": response.choices[0].message.content
                }]
            }]
        }

        return jsonify(response_obj), 200
    else:
        return Response(stream_without_data(response))
