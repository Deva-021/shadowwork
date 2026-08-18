from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from tools.tickets import get_ticket, update_ticket
from tools.orders import get_order
from tools.knowledge import get_refund_policy
from tools.approval import process_refund, get_approval, update_approval
from tools.workflow import record_event, get_events, clear_events
from tools.skill_executor import execute_skill
from tools.workflow_analyzer import analyze_workflow


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://shadowwork-6hgnhm5kr-deva-021s-projects.vercel.app",
        "https://shadowwork-kr31yybor-deva-021s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "ShadowWork backend is running"}


@app.get("/ticket/{ticket_id}")
def ticket(ticket_id: int):
    return get_ticket(ticket_id)


@app.get("/order/{order_id}")
def order(order_id: int):
    return get_order(order_id)


@app.get("/refund-policy")
def refund_policy():
    return get_refund_policy()


@app.post("/refund/{ticket_id}/{amount}")
def process_refund_request(ticket_id: int, amount: float):
    return process_refund(ticket_id, amount)


@app.get("/approval/{approval_id}")
def approval(approval_id: int):
    return get_approval(approval_id)


@app.put("/approval/{approval_id}/{status}")
def change_approval(approval_id: int, status: str):
    return update_approval(approval_id, status)


@app.put("/ticket/{ticket_id}/{status}")
def change_ticket_status(ticket_id: int, status: str):
    return update_ticket(ticket_id, status)


@app.post("/workflow/record")
def record_workflow_event(action: str, details: str):
    return record_event(action, details)


@app.get("/workflow/events")
def workflow_events():
    return get_events()


@app.delete("/workflow/clear")
def clear_workflow():
    return clear_events()


# NEW: Analyze the employee's recorded workflow
@app.get("/workflow/analyze")
def analyze_current_workflow():
    events = get_events()
    return analyze_workflow(events)

@app.post("/workflow/execute")
def execute_workflow(
    ticket_id: int,
    order_id: int,
    amount: float
):
    events = get_events()

    if not events:
        return {
            "status": "Failed",
            "message": "No workflow has been recorded yet."
        }

    from tools.workflow_analyzer import analyze_workflow

    analysis = analyze_workflow(events)

    skill = analysis.get("reusable_skill")

    if not skill:
        return {
            "status": "Failed",
            "message": "No reusable skill was generated."
        }

    return execute_skill(
        skill,
        ticket_id,
        order_id,
        amount
    )