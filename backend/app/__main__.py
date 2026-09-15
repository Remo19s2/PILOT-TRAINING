import os

import uvicorn

if __name__ == "__main__":
    is_production = os.getenv("APP_ENV", "development") == "production"
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "127.0.0.1") if not is_production else "0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=not is_production,
    )
