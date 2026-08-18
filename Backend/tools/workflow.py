from datetime import datetime

workflow_events = []


def record_event(action, details):
    event = {
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "action": action,
        "details": details
    }

    workflow_events.append(event)

    return event


def get_events():
    return workflow_events


def clear_events():
    workflow_events.clear()

    return {"message": "Workflow events cleared"}