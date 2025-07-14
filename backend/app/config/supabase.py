from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Explicitly specify the .env file path
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Debug print to verify values
print(f"DEBUG: .env path: {env_path}")
print(f"DEBUG: SUPABASE_URL: {supabase_url}")
print(f"DEBUG: SUPABASE_SERVICE_ROLE_KEY: {supabase_service_role_key}")

if not supabase_url or not supabase_service_role_key:
    raise ValueError(f"Missing environment variables: SUPABASE_URL={supabase_url}, SUPABASE_SERVICE_ROLE_KEY={supabase_service_role_key}")

supabase: Client = create_client(supabase_url, supabase_service_role_key)