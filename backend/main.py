from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.db import Base, engine, SessionLocal
from app.models import User
from app.schemas import RegisterIn, LoginIn, TokenOut
from app.security import hash_password, verify_password, create_access_token

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(title= "Alizè")

# CORS: autorise le frontend (localhost:3000) à appeler l'API (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return { "ok": True}

@app.post("/auth/register", response_model=TokenOut)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}

@app.post("/auth/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/matches")
def matches_mock():
    # V1: mock pour valider le dashboard, avant de brancher les vraies sources
    return [
        {
            "title": "Alternance Data Analyst",
            "company": "ExampleCorp",
            "location": "Paris (hybride)",
            "url": "https://example.com/job/1",
            "score": 92,
        },
        {
            "title": "Stage Web Developer",
            "company": "StartupX",
            "location": "Remote",
            "url": "https://example.com/job/2",
            "score": 86,
        },
    ]