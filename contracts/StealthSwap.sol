// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract StealthSwap is SepoliaConfig {
    using FHE for *;
    
    struct SwapRequest {
        euint32 requestId;
        euint32 amount;
        euint32 targetAmount;
        address sender;
        address recipient;
        uint256 sourceChainId;
        uint256 targetChainId;
        string sourceToken;
        string targetToken;
        bool isActive;
        bool isCompleted;
        uint256 timestamp;
        uint256 deadline;
    }
    
    struct BridgeTransaction {
        euint32 bridgeId;
        euint32 amount;
        address user;
        uint256 sourceChainId;
        uint256 targetChainId;
        string tokenSymbol;
        bool isProcessed;
        bool isSettled;
        uint256 timestamp;
        bytes32 merkleProof;
    }
    
    struct PrivacySettings {
        euint8 privacyLevel;
        ebool hideAmount;
        ebool hideSender;
        ebool hideRecipient;
        ebool useZeroKnowledge;
    }
    
    mapping(uint256 => SwapRequest) public swapRequests;
    mapping(uint256 => BridgeTransaction) public bridgeTransactions;
    mapping(address => euint32) public userReputation;
    mapping(address => PrivacySettings) public userPrivacySettings;
    mapping(string => euint32) public tokenLiquidity;
    
    uint256 public swapRequestCounter;
    uint256 public bridgeTransactionCounter;
    
    address public owner;
    address public bridgeOperator;
    address public privacyVerifier;
    
    // Events
    event SwapRequestCreated(uint256 indexed requestId, address indexed sender, uint256 sourceChainId, uint256 targetChainId);
    event BridgeTransactionInitiated(uint256 indexed bridgeId, address indexed user, uint256 sourceChainId, uint256 targetChainId);
    event SwapCompleted(uint256 indexed requestId, address indexed recipient, uint32 amount);
    event BridgeSettled(uint256 indexed bridgeId, address indexed user, uint32 amount);
    event PrivacySettingsUpdated(address indexed user, uint8 privacyLevel);
    event LiquidityUpdated(string indexed token, uint32 amount);
    
    constructor(address _bridgeOperator, address _privacyVerifier) {
        owner = msg.sender;
        bridgeOperator = _bridgeOperator;
        privacyVerifier = _privacyVerifier;
    }
    
    function createSwapRequest(
        externalEuint32 amount,
        externalEuint32 targetAmount,
        address recipient,
        uint256 targetChainId,
        string memory sourceToken,
        string memory targetToken,
        uint256 deadline,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(bytes(sourceToken).length > 0, "Source token cannot be empty");
        require(bytes(targetToken).length > 0, "Target token cannot be empty");
        
        uint256 requestId = swapRequestCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        euint32 internalTargetAmount = FHE.fromExternal(targetAmount, inputProof);
        
        swapRequests[requestId] = SwapRequest({
            requestId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            targetAmount: internalTargetAmount,
            sender: msg.sender,
            recipient: recipient,
            sourceChainId: block.chainid,
            targetChainId: targetChainId,
            sourceToken: sourceToken,
            targetToken: targetToken,
            isActive: true,
            isCompleted: false,
            timestamp: block.timestamp,
            deadline: deadline
        });
        
        emit SwapRequestCreated(requestId, msg.sender, block.chainid, targetChainId);
        return requestId;
    }
    
    function initiateBridgeTransaction(
        externalEuint32 amount,
        uint256 targetChainId,
        string memory tokenSymbol,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(tokenSymbol).length > 0, "Token symbol cannot be empty");
        require(targetChainId != block.chainid, "Target chain must be different");
        
        uint256 bridgeId = bridgeTransactionCounter++;
        
        // Convert external encrypted amount to internal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        bridgeTransactions[bridgeId] = BridgeTransaction({
            bridgeId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            user: msg.sender,
            sourceChainId: block.chainid,
            targetChainId: targetChainId,
            tokenSymbol: tokenSymbol,
            isProcessed: false,
            isSettled: false,
            timestamp: block.timestamp,
            merkleProof: bytes32(0) // Will be set by bridge operator
        });
        
        emit BridgeTransactionInitiated(bridgeId, msg.sender, block.chainid, targetChainId);
        return bridgeId;
    }
    
    function completeSwap(
        uint256 requestId,
        externalEuint32 finalAmount,
        bytes calldata inputProof
    ) public {
        require(swapRequests[requestId].sender != address(0), "Swap request does not exist");
        require(swapRequests[requestId].isActive, "Swap request is not active");
        require(block.timestamp <= swapRequests[requestId].deadline, "Swap request has expired");
        require(msg.sender == bridgeOperator, "Only bridge operator can complete swaps");
        
        // Convert external encrypted amount to internal
        euint32 internalFinalAmount = FHE.fromExternal(finalAmount, inputProof);
        
        swapRequests[requestId].isCompleted = true;
        swapRequests[requestId].isActive = false;
        
        emit SwapCompleted(requestId, swapRequests[requestId].recipient, 0); // Amount will be decrypted off-chain
    }
    
    function settleBridgeTransaction(
        uint256 bridgeId,
        bytes32 merkleProof
    ) public {
        require(bridgeTransactions[bridgeId].user != address(0), "Bridge transaction does not exist");
        require(!bridgeTransactions[bridgeId].isSettled, "Bridge transaction already settled");
        require(msg.sender == bridgeOperator, "Only bridge operator can settle transactions");
        
        bridgeTransactions[bridgeId].isSettled = true;
        bridgeTransactions[bridgeId].isProcessed = true;
        bridgeTransactions[bridgeId].merkleProof = merkleProof;
        
        emit BridgeSettled(bridgeId, bridgeTransactions[bridgeId].user, 0); // Amount will be decrypted off-chain
    }
    
    function updatePrivacySettings(
        externalEuint8 privacyLevel,
        ebool hideAmount,
        ebool hideSender,
        ebool hideRecipient,
        ebool useZeroKnowledge,
        bytes calldata inputProof
    ) public {
        euint8 internalPrivacyLevel = FHE.fromExternal(privacyLevel, inputProof);
        
        userPrivacySettings[msg.sender] = PrivacySettings({
            privacyLevel: internalPrivacyLevel,
            hideAmount: hideAmount,
            hideSender: hideSender,
            hideRecipient: hideRecipient,
            useZeroKnowledge: useZeroKnowledge
        });
        
        emit PrivacySettingsUpdated(msg.sender, 0); // Privacy level will be decrypted off-chain
    }
    
    function updateUserReputation(
        address user,
        externalEuint32 reputation,
        bytes calldata inputProof
    ) public {
        require(msg.sender == privacyVerifier, "Only privacy verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        euint32 internalReputation = FHE.fromExternal(reputation, inputProof);
        userReputation[user] = internalReputation;
    }
    
    function updateTokenLiquidity(
        string memory tokenSymbol,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public {
        require(msg.sender == bridgeOperator, "Only bridge operator can update liquidity");
        require(bytes(tokenSymbol).length > 0, "Token symbol cannot be empty");
        
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        tokenLiquidity[tokenSymbol] = internalAmount;
        
        emit LiquidityUpdated(tokenSymbol, 0); // Amount will be decrypted off-chain
    }
    
    // View functions (encrypted data will be decrypted off-chain)
    function getSwapRequestInfo(uint256 requestId) public view returns (
        address sender,
        address recipient,
        uint256 sourceChainId,
        uint256 targetChainId,
        string memory sourceToken,
        string memory targetToken,
        bool isActive,
        bool isCompleted,
        uint256 timestamp,
        uint256 deadline
    ) {
        SwapRequest storage request = swapRequests[requestId];
        return (
            request.sender,
            request.recipient,
            request.sourceChainId,
            request.targetChainId,
            request.sourceToken,
            request.targetToken,
            request.isActive,
            request.isCompleted,
            request.timestamp,
            request.deadline
        );
    }
    
    function getBridgeTransactionInfo(uint256 bridgeId) public view returns (
        address user,
        uint256 sourceChainId,
        uint256 targetChainId,
        string memory tokenSymbol,
        bool isProcessed,
        bool isSettled,
        uint256 timestamp,
        bytes32 merkleProof
    ) {
        BridgeTransaction storage transaction = bridgeTransactions[bridgeId];
        return (
            transaction.user,
            transaction.sourceChainId,
            transaction.targetChainId,
            transaction.tokenSymbol,
            transaction.isProcessed,
            transaction.isSettled,
            transaction.timestamp,
            transaction.merkleProof
        );
    }
    
    function getUserPrivacySettings(address user) public view returns (
        uint8 privacyLevel,
        bool hideAmount,
        bool hideSender,
        bool hideRecipient,
        bool useZeroKnowledge
    ) {
        PrivacySettings storage settings = userPrivacySettings[user];
        return (
            0, // FHE.decrypt(settings.privacyLevel) - will be decrypted off-chain
            false, // FHE.decrypt(settings.hideAmount) - will be decrypted off-chain
            false, // FHE.decrypt(settings.hideSender) - will be decrypted off-chain
            false, // FHE.decrypt(settings.hideRecipient) - will be decrypted off-chain
            false  // FHE.decrypt(settings.useZeroKnowledge) - will be decrypted off-chain
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function getTokenLiquidity(string memory tokenSymbol) public view returns (uint8) {
        return 0; // FHE.decrypt(tokenLiquidity[tokenSymbol]) - will be decrypted off-chain
    }
    
    // Admin functions
    function setBridgeOperator(address _bridgeOperator) public {
        require(msg.sender == owner, "Only owner can set bridge operator");
        require(_bridgeOperator != address(0), "Invalid bridge operator address");
        bridgeOperator = _bridgeOperator;
    }
    
    function setPrivacyVerifier(address _privacyVerifier) public {
        require(msg.sender == owner, "Only owner can set privacy verifier");
        require(_privacyVerifier != address(0), "Invalid privacy verifier address");
        privacyVerifier = _privacyVerifier;
    }
    
    function emergencyPause() public {
        require(msg.sender == owner, "Only owner can pause contract");
        // Implementation for emergency pause functionality
    }
    
    function emergencyUnpause() public {
        require(msg.sender == owner, "Only owner can unpause contract");
        // Implementation for emergency unpause functionality
    }
}
