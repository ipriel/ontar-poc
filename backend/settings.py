from os import path 
from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

DOTENV_PATH = path.join(
    path.dirname(
        path.dirname(__file__)
    ),
    ".env"
)

class _AzureSearchSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=DOTENV_PATH,
        env_prefix='AZURE_SEARCH_',
        extra='ignore',
        env_ignore_empty=True
    )

    service: str|None = Field(default=None)
    index: str|None = Field(default=None)
    key: str|None = Field(default=None)
    use_semantic_search: bool = Field(default=False)
    semantic_search_config: str = Field(default="default")
    top_k: int = Field(default=5)
    enable_in_domain: str = Field(default="true")
    content_columns: str|None = Field(default=None)
    filename_column: str|None = Field(default=None)
    title_column: str|None = Field(default=None)
    url_column: str|None = Field(default=None)
    vector_columns: str|None = Field(default=None)
    query_type: str|None = Field(default=None)
    permitted_groups_column: str|None = Field(default=None)

class _AzureOpenAISettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=DOTENV_PATH,
        env_prefix='AZURE_OPENAI_',
        extra='ignore',
        env_ignore_empty=True,
        protected_namespaces=('settings_',)
    )

    resource: str|None = Field(default=None)
    model: str|None = Field(default=None)
    endpoint: str|None = Field(default=None)
    key: str|None = Field(default=None)
    temperature: int = Field(default=0)
    top_p: int = Field(default=1.0)
    max_tokens: int = Field(default=1000)
    stop_sequence: str|None = Field(default=None)
    system_message: str = Field(default="You are an AI assistant that helps people find information.")
    preview_api_version: str = Field(default="2023-06-01-preview")
    model_name: str = Field(default="gpt-35-turbo")
    embedding_endpoint: str|None = Field(default=None)
    embedding_key: str|None = Field(default=None)
    stream: str = Field(default='True')

    @computed_field
    @property
    def should_stream(self) -> bool:
        return self.stream.lower() == "true"
    
    @computed_field
    @property
    def base_url(self) -> str:
        return self.endpoint if self.endpoint else f"https://{self.resource}.openai.azure.com/"

class _AppSettings():
    search: _AzureSearchSettings = _AzureSearchSettings()
    openai: _AzureOpenAISettings = _AzureOpenAISettings()

app_settings = _AppSettings()