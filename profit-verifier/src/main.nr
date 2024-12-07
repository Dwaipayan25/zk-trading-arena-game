fn main(initial_balance: u32, final_balance: u32, threshold: u32) {
    let profit = (final_balance - initial_balance) * 100 / initial_balance;
    assert(profit >= threshold, "Profit does not meet the threshold");
}
