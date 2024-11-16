module vivek::PokemonBattle_01 {
    use std::string::{String, utf8};
    use std::signer;
    use aptos_framework::randomness;

    struct BattleResult has key {
        computer_selection: String,
        battle_result: String,
    }

    public entry fun create_game(account: &signer) acquires BattleResult {
        if (exists<BattleResult>(signer::address_of(account))) {
            let result = borrow_global_mut<BattleResult>(signer::address_of(account));
            result.computer_selection = utf8(b"New Game Created");
            result.battle_result = utf8(b"Battle not yet played");
        } else {
            let result = BattleResult {
                computer_selection: utf8(b"New Game Created"),
                battle_result: utf8(b"Battle not yet played"),
            };
            move_to(account, result);
        }
    }

    public fun get_result(account: &signer): (String, String) acquires BattleResult {
        let result = borrow_global<BattleResult>(signer::address_of(account));
        (result.computer_selection, result.battle_result)
    }

   #[randomness]
public(friend) entry fun battle(account: &signer, user_selection: String) acquires BattleResult {
    let random_number = randomness::u64_range(0, 5);
    let result = borrow_global_mut<BattleResult>(signer::address_of(account));

    if (random_number == 0) {
        result.computer_selection = utf8(b"Ground");
    } else if (random_number == 1) {
        result.computer_selection = utf8(b"Fire");
    } else if (random_number == 2) {
        result.computer_selection = utf8(b"Grass");
    } else if (random_number == 3) {
        result.computer_selection = utf8(b"Water");
    } else {
        result.computer_selection = utf8(b"Flying");
    };

    if (utf8_equals(&user_selection, &result.computer_selection)) {
        result.battle_result = utf8(b"Draw");
    } else if (
        (utf8_equals(&user_selection, &utf8(b"Ground")) && (utf8_equals(&result.computer_selection, &utf8(b"Fire")) || utf8_equals(&result.computer_selection, &utf8(b"Flying")))) ||
        (utf8_equals(&user_selection, &utf8(b"Fire")) && (utf8_equals(&result.computer_selection, &utf8(b"Grass")) || utf8_equals(&result.computer_selection, &utf8(b"Flying")))) ||
        (utf8_equals(&user_selection, &utf8(b"Grass")) && (utf8_equals(&result.computer_selection, &utf8(b"Water")) || utf8_equals(&result.computer_selection, &utf8(b"Ground")))) ||
        (utf8_equals(&user_selection, &utf8(b"Water")) && (utf8_equals(&result.computer_selection, &utf8(b"Fire")) || utf8_equals(&result.computer_selection, &utf8(b"Ground")))) ||
        (utf8_equals(&user_selection, &utf8(b"Flying")) && (utf8_equals(&result.computer_selection, &utf8(b"Grass")) || utf8_equals(&result.computer_selection, &utf8(b"Water"))))
    ) {
        result.battle_result = utf8(b"Win");
    } else {
        result.battle_result = utf8(b"Lose");
    }
}


    public fun utf8_equals(a: &String, b: &String): bool {
        let a_bytes = std::string::bytes(a);
        let b_bytes = std::string::bytes(b);
        a_bytes == b_bytes
    }
}
