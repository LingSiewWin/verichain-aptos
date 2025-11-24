#[test_only]
module verichain::verichain_tests {
  use verichain::verichain::{Self, AIResource, RWAToken};
  use aptos_framework::account;
  use std::vector;
  use std::bcs;

  #[test(admin = @0x1)]
  fun test_deploy_agent_success(admin: &signer) {
    verichain::deploy_agent(admin);
    let addr = account::get_signer_address(admin);
    assert!(exists<AIResource>(addr), 1001);
  }

  #[test(admin = @0x1, malicious = @0x2)]
  #[expected_failure(abort_code = 1003)]
  fun test_deploy_agent_already_exists(admin: &signer, malicious: &signer) {
    verichain::deploy_agent(admin);
    verichain::deploy_agent(admin); // Should abort: E_UNAUTHORIZED
  }

  #[test(admin = @0x1)]
  fun test_verify_and_tokenize_valid_proof(admin: &signer) {
    verichain::deploy_agent(admin);
    let input = vector::singleton(42u64);
    let output = 111u64;
    let receipt = bcs::to_bytes(&vector::singleton(100u64));

    verichain::verify_and_tokenize(admin, input, output, receipt);
    let addr = account::get_signer_address(admin);
    assert!(verichain::get_ai_locked(addr), 1001);
  }

  #[test(admin = @0x1)]
  #[expected_failure(abort_code = 1001)]
  fun test_verify_and_tokenize_locked_reentrant(admin: &signer) {
    verichain::deploy_agent(admin);
    let input = vector::singleton(42u64);
    let output = 111u64;
    let receipt = bcs::to_bytes(&vector::singleton(100u64));

    verichain::verify_and_tokenize(admin, input, output, receipt);
    // Second call should fail: AIResource already locked
    verichain::verify_and_tokenize(admin, input, output, receipt);
  }

  #[test(admin = @0x1)]
  fun test_unlock_agent_success(admin: &signer) {
    verichain::deploy_agent(admin);
    let input = vector::singleton(42u64);
    let output = 111u64;
    let receipt = bcs::to_bytes(&vector::singleton(100u64));

    verichain::verify_and_tokenize(admin, input, output, receipt);
    let addr = account::get_signer_address(admin);
    assert!(verichain::get_ai_locked(addr), 1001);

    verichain::unlock_agent(admin);
    assert!(!verichain::get_ai_locked(addr), 1004);
  }

  #[test(admin = @0x1)]
  #[expected_failure(abort_code = 1004)]
  fun test_unlock_agent_not_locked(admin: &signer) {
    verichain::deploy_agent(admin);
    // Try to unlock without locking first
    verichain::unlock_agent(admin);
  }
}
