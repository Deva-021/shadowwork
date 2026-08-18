from tools.workflow import record_event

tickets = {
    1001: {
        "ticket_id": 1001,
        "customer": "Rahul",
        "issue": "I want a refund for my laptop",
        "order_id": 4521,
        "status": "Open"
    },
    1002: {
        "ticket_id": 1002,
        "customer": "Arjun",
        "issue": "My product arrived damaged",
        "order_id": 7821,
        "status": "Open"
    }
}


def get_ticket(ticket_id):
    ticket = tickets.get(ticket_id)

    if ticket:
        record_event(
            "Open Ticket",
            f"Ticket #{ticket_id}"
        )

    return ticket


def update_ticket(ticket_id, status):
    if ticket_id in tickets:
        tickets[ticket_id]["status"] = status

        record_event(
            "Update Ticket",
            f"Ticket #{ticket_id} → {status}"
        )

        return tickets[ticket_id]

    return None