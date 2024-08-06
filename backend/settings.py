import os
from dotenv import load_dotenv

load_dotenv()

class _AzureSearchSettings():
    service = os.environ.get("AZURE_SEARCH_SERVICE")
    index = os.environ.get("AZURE_SEARCH_INDEX")
    key = os.environ.get("AZURE_SEARCH_KEY")
    use_semantic_search = os.environ.get("AZURE_SEARCH_use_semantic_search", "false")
    semantic_search_config = os.environ.get("AZURE_SEARCH_SEMANTIC_SEARCH_CONFIG", "default")
    top_k = os.environ.get("AZURE_SEARCH_TOP_K", 5)
    enable_in_domain = os.environ.get("AZURE_SEARCH_ENABLE_IN_DOMAIN", "true")
    content_columns = os.environ.get("AZURE_SEARCH_CONTENT_COLUMNS")
    filename_column = os.environ.get("AZURE_SEARCH_FILENAME_COLUMN")
    title_column = os.environ.get("AZURE_SEARCH_TITLE_COLUMN")
    url_column = os.environ.get("AZURE_SEARCH_URL_COLUMN")
    vector_columns = os.environ.get("AZURE_SEARCH_VECTOR_COLUMNS")
    query_type = os.environ.get("AZURE_SEARCH_QUERY_TYPE")
    permitted_groups_column = os.environ.get("AZURE_SEARCH_PERMITTED_GROUPS_COLUMN")

class _AzureOpenAISettings():
    # AOAI Integration Settings
    resource = os.environ.get("AZURE_OPENAI_RESOURCE")
    model = os.environ.get("AZURE_OPENAI_MODEL")
    endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
    key = os.environ.get("AZURE_OPENAI_KEY")
    temperature = os.environ.get("AZURE_OPENAI_TEMPERATURE", 0)
    top_p = os.environ.get("AZURE_OPENAI_TOP_P", 1.0)
    max_tokens = os.environ.get("AZURE_OPENAI_MAX_TOKENS", 1000)
    stop_sequence = os.environ.get("AZURE_OPENAI_STOP_SEQUENCE")
    system_message = os.environ.get("AZURE_OPENAI_SYSTEM_MESSAGE", "You are an AI assistant that helps people find information.")
    preview_api_version = os.environ.get("AZURE_OPENAI_PREVIEW_API_VERSION", "2023-06-01-preview")
    _stream = os.environ.get("AZURE_OPENAI_STREAM", "true")
    model_name = os.environ.get("AZURE_OPENAI_MODEL_NAME", "gpt-35-turbo") # Name of the model, e.g. 'gpt-35-turbo' or 'gpt-4'
    embedding_endpoint = os.environ.get("AZURE_OPENAI_EMBEDDING_ENDPOINT")
    embedding_key = os.environ.get("AZURE_OPENAI_EMBEDDING_KEY")
    should_stream = True if _stream.lower() == "true" else False

class _AppSettings():
    search = _AzureSearchSettings()
    openai = _AzureOpenAISettings()

app_settings = _AppSettings()