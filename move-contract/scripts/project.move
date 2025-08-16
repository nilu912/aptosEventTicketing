module EventTicketing::Tickets {

    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Event resource containing ticket details
    struct Event has key {
        total_tickets: u64,   // Total tickets available
        sold_tickets: u64,    // Tickets already sold
        price: u64,           // Price per ticket in AptosCoin
    }

    /// Organizer creates an event with ticket supply and price
    public fun create_event(organizer: &signer, total_tickets: u64, price: u64) {
        let event = Event {
            total_tickets,
            sold_tickets: 0,
            price,
        };
        move_to(organizer, event);
    }

    /// Users can buy a ticket by paying the ticket price
    public fun buy_ticket(buyer: &signer, organizer: address) acquires Event {
        let event = borrow_global_mut<Event>(organizer);
        assert!(event.sold_tickets < event.total_tickets, 1);

        // Payment transfer
        let payment = coin::withdraw<AptosCoin>(buyer, event.price);
        coin::deposit<AptosCoin>(organizer, payment);

        // Update ticket count
        event.sold_tickets = event.sold_tickets + 1;
    }
}
