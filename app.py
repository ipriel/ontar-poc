import logging
from quart import (
    Blueprint,
    Quart,
    jsonify,
    request,
    Response,
    send_from_directory,
    websocket
)
from backend.settings import app_settings
from backend.utils.azure import (
    conversation_with_data,
    conversation_without_data,
    fetchUpdate
)
from backend.utils.data import Message, EventType, setupLogging
from backend.broker import Broker

bp = Blueprint("routes", __name__, static_folder="static", template_folder="static")
broker = Broker()
logger = logging.getLogger(__name__)

def create_app():
    setupLogging()
    
    app = Quart(__name__)
    app.register_blueprint(bp)
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    return app

# Static File Routes
@bp.route("/", methods=["GET"])
async def index():
    logger.debug("Page loaded")
    return await bp.send_static_file("index.html")

@bp.route("/favicon.ico", methods=["GET"])
async def favicon():
    return await bp.send_static_file('favicon.ico')

@bp.route("/assets/<path:path>", methods=["GET"])
async def assets(path):
    return await send_from_directory("static/assets", path)

# Webhooks
@bp.route("/interop/new_event", methods=["POST"])
async def new_event():
    request_json = await request.get_json()
    await broker.publish(Message(EventType.NEW, request_json))
    return Response("OK"), 200

@bp.route("/interop/update_event", methods=["POST"])
async def update_event():
    request_json = await request.get_json()
    await broker.publish(Message(EventType.UPDATE, request_json))
    return Response("OK"), 200

@bp.route("/interop/close_event", methods=["POST"])
async def close_event():
    request_json = await request.get_json()
    await broker.publish(Message(EventType.CLOSE, request_json))
    return Response("OK"), 200

# App Routes
@bp.route("/conversation", methods=["GET", "POST"])
async def conversation():
    try:
        if app_settings.search.service and app_settings.search.index and app_settings.search.key:
            result = await conversation_with_data(request)
            return result
        else:
            return await conversation_without_data(request)
    except Exception as e:
        logger.exception("Exception in /conversation: %s", repr(e))
        return jsonify({"error": repr(e)}), 500

@bp.route("/api/riskyUsers", methods=["GET"])
async def getRiskyUsers():
    try:
        data, status_code = fetchUpdate("getRiskyUsers", app_settings.functions.risky_users_key, True)
        return jsonify(data), status_code
    except Exception as e:
        logger.exception("Exception in /api/riskyUsers: %s", repr(e))
        return jsonify({"error": repr(e)}), 500

@bp.route("/api/alerts", methods=["GET"])
async def getAlerts():
    try:
        data, status_code = fetchUpdate("getAlerts", app_settings.functions.alerts_key, True)
        return jsonify(data), status_code
    except Exception as e:
        logger.exception("Exception in /api/alerts: %s", repr(e))
        return jsonify({"error": repr(e)}), 500

@bp.route("/api/incidents", methods=["GET"])
async def getIncidents():
    try:
        data, status_code = fetchUpdate("getIncidents", app_settings.functions.incidents_key, True)
        return jsonify(data), status_code
    except Exception as e:
        logger.exception("Exception in /api/incidents: %s", repr(e))
        return jsonify({"error": repr(e)}), 500

@bp.route("/api/adRecommendations", methods=["GET"])
async def getADRecommendations():
    try:
        data, status_code = fetchUpdate("getADRecommendations", app_settings.functions.adrecommendations_key, True)
        return jsonify(data), status_code
    except Exception as e:
        logger.exception("Exception in /api/adRecommendations: %s", repr(e))
        return jsonify({"error": repr(e)}), 500

@bp.route("/api/recommendations", methods=["GET"])
async def getRecommendations():
    try:
        data, status_code = fetchUpdate("getRecommendations", app_settings.functions.recommendations_key)
        return jsonify(data), status_code
    except Exception as e:
        logger.exception("Exception in /api/recommendations: %s", repr(e))
        return jsonify({"error": repr(e)}), 500

@bp.route("/api/remediations", methods=["GET"])
async def getRemediations():
    try:
        data, status_code = fetchUpdate("getRemediations", app_settings.functions.remediations_key)
        return jsonify(data), status_code
    except Exception as e:
        logger.exception("Exception in /api/remediations: %s", repr(e))
        return jsonify({"error": repr(e)}), 500

@bp.websocket("/notifier")
async def notifier():
    logger.info("WS connection received from: %s", websocket.remote_addr)
    await websocket.send(f"OK")
    async for message in broker.subscribe():
        logger.debug(f"{message}")
        await websocket.send(f"{message}")



# Init App
app = create_app()
