fn main(initial_balance: u32, final_balance: u32, proof_range: pub u32, game_number: pub u32) {
    // Ensure valid game number (optional, depending on requirements)
    assert(game_number > 0, "Game number must be greater than 0");

    // Calculate profit percentage
    let profit = (final_balance - initial_balance) * 100 / initial_balance;

    // Generate proof for profit range
    if proof_range == 0 {
        // Range 0-20%
        assert(profit >= 0, "Profit below 0%");
        assert(profit <= 20, "Profit above 20%");
    } else if proof_range == 1 {
        // Range 21-40%
        assert(profit > 20, "Profit not above 20%");
        assert(profit <= 40, "Profit above 40%");
    } else if proof_range == 2 {
        // Range >40%
        assert(profit > 40, "Profit not above 40%");
    } else {
        // Invalid range
        assert(false, "Invalid proof range");
    }
}
