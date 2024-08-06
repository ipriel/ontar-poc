import logging
from quart import (
    Blueprint,
    Quart,
    jsonify,
    request,
    send_from_directory
)
from backend.settings import app_settings
from backend.utils.azure import (
    conversation_with_data,
    conversation_without_data
)

bp = Blueprint("routes", __name__, static_folder="static", template_folder="static")

def create_app():
    app = Quart(__name__)
    app.register_blueprint(bp)
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    return app

# Static File Routes
@bp.route("/")
async def index():
    return await bp.send_static_file("index.html")

@bp.route("/favicon.ico")
async def favicon():
    return await bp.send_static_file('favicon.ico')

@bp.route("/assets/<path:path>")
async def assets(path):
    return await send_from_directory("static/assets", path)

# App Routes
@bp.route("/conversation", methods=["GET", "POST"])
async def conversation():
    try:
        if app_settings.search.service and app_settings.search.index and app_settings.search.key:
            result = await conversation_with_data(request)
            print(str(result))
            return result
        else:
            return await conversation_without_data(request)
    except Exception as e:
        logging.exception("Exception in /conversation")
        return jsonify({"error": str(e)}), 500

# Init App
app = create_app()
