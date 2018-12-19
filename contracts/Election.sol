pragma solidity ^0.4.2;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint provinceId;
        uint voteCount;
        uint partyId;
    }
    // Model a Party 
    struct Party {
        uint id;
        string name;
        uint voteCount;
    }

     struct Province {
        uint id;
        string tokens;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;    
    mapping(uint => Party) public parties;
    // Store Candidates Count
    uint public candidatesCount;
    uint public partiesCount; 

    // voted event
    event votedEvent (
        uint indexed _candidateId,     
        uint indexed _partyId   
    );

    event eventAddedParty (
        uint id,
        string name,
        uint voteCount
    );

    function Election () public {

         //Initialize Parties
        addParty("CDU");
        addParty("SPD");
        addParty("FDP");

        addCandidate("Peter Fox", 1, 1);
        addCandidate("Khan Humble", 1, 2);
        addCandidate("Fred Fessler", 2,1);
        addCandidate("Dick Smith", 2, 2);
        addCandidate("Napol Hammer", 2, 3);  

    }

    function addCandidate (string _name, uint _provinceId, uint _partyOfCandidate) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _provinceId,  0, _partyOfCandidate);
    }

     function addParty (string _name) private {
         partiesCount++;
         parties[partiesCount] = Party(partiesCount, _name, 0); 
         eventAddedParty(partiesCount, _name, 0);
     }
       
    function vote(uint _candidateId, uint _provinceId, uint _partyId) public {

        // require that they haven't voted before
        require(!voters[msg.sender]);
        require(_provinceId == candidates[_candidateId].provinceId);
        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);
       
        // record that voter has voted , DEFAULT = TRUE (means sender can only vote once)
        voters[msg.sender] = false;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        votedEvent(_candidateId, _partyId);
    }
}
