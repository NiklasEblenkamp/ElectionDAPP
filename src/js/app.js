App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  partiesCount: 3,
  candidatesCount: 5,
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        
      });
      instance.eventAddedParty({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        console.log("The party "+event.args.name+" was added. Id: "+event.args.id)
        // Reload when a new vote is recorded
        
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var loader2 = $("#loader2");
    var content2 = $("#content2");

    var resultsParties = $("#resultsParties");
    var resultsCandidate = $("#resultsCandidate");

    loader.show();
    content.hide();    
    loader2.show();
    content2.hide();

    resultsParties.hide();
    resultsCandidate.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;          
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      //clear result tables
      App.candidatesCount = candidatesCount;
   

      var resultListCandidates = $("#resultListCandidate");
      var resultListParties = $("#resultListParties");
      resultListCandidates.empty();
      resultListParties.empty();

      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      var partiesResults = $("#partiesResults");
      partiesResults.empty();

      var partiesSelect = $('#partiesSelect');
      partiesSelect.empty();


      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          console.log("candidate  "+candidate);
          var id = candidate[0];
          var name = candidate[1];
          var _provinceId = candidate[2];
          var partyId = candidate[4];
         
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td> <img src='imgs/" +partyId+".png' alt='' border=3 height=25 width=40></img></td><td><label class='container'> <input type='radio' value='"+id+"' name='radio2'> <span class='checkmark'></span> </label></td></tr>";
          candidatesResults.append(candidateTemplate);
         
         /* Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption); */
        });
      }
      candidatesResults.append("<tr><td colspan='2'></td><td>Please choose a candidate</td><td><label class='container'> <input type='radio' checked='checked' name='radio2'> <span class='checkmark'></span> </label></td></tr>");
      //Load Partytable
    for (var i = 1; i <= App.partiesCount; i++) {      
      electionInstance.parties(i).then(function(party) {
        var id = party[0];
        var name = party[1]; 
        var voteCount = party[2];       
        // Render party Result        
        var partyTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td><img src='imgs/" +id+".png' alt='' border=3 height=25 width=40></img></td><td><label class='container'> <input type='radio' value='"+id+"' name='radio'> <span class='checkmark'></span> </label></td></tr>" 
        partiesResults.append(partyTemplate);
        // Render party ballot option       
      });
    }
    partiesResults.append("<tr><td colspan='2'></td><td>Please choose a party</td><td><label class='container'> <input type='radio' checked='checked' name='radio'> <span class='checkmark'></span> </label></td></tr>");
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {        
      // Do not allow a user to vote
      console.log(App.candidatesCount+"<- C   P >"+App.partiesCount);
      if(hasVoted) {
        $('btn btn-primary').hide();
        //Create Candidate Result table
        
        for(var i = 1; i <= App.candidatesCount; i++){
          electionInstance.candidates(i).then(function(candidate) {     
          var id = candidate[0];
          var name = candidate[1];
          var votesCandidate = candidate[3];
          var partyId = candidate[4];
          var _resultListCandidates = "<tr><th>" + id + "</th><td>" + name + "</td><td><img src='imgs/" +partyId+".png' alt='' border=3 height=25 width=40></img></td><td>"+votesCandidate+"</td></tr>"; 
          console.log(_resultListCandidates);
          resultListCandidates.append(_resultListCandidates);
          });
        }  
         //Create Party Result table
         for(var i = 1; i <= App.partiesCount; i++){
          electionInstance.parties(i).then(function(party) {
          var id = party[0];
          var name = party[1]; 
          var voteCount = party[2];
          var _resultListParties = "<tr><th>" + id + "</th><td>" + name + "</td><td><img src='imgs/" +id+".png' alt='' border=3 height=25 width=40></img></td><td>"+voteCount+"</td></tr>"; 
          resultListParties.append(_resultListParties);
          });
        }
          
        
      $('#voteButton').hide();
      loader.hide();
      content.hide();
      loader2.hide();
      content2.hide();
      resultsParties.show();
      resultsCandidate.show();
    }}).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('input[name=radio2]:checked').val();
    var partyId = $('input[name=radio]:checked').val();
    console.log("ate: "+candidateId+" and the Party:"+partyId)  ;
    if(candidateId ==  "on"){
      alert("Please choose a candidate and try again");
      return;
    } 
    if(partyId == "on"){
      alert("Please choose a party and try again");  
      return;
    } 
       
    App.contracts.Election.deployed().then(function(instance) {   //function vote(uint _candidateId, uint _provinceId, uint _partyId) public {
    //console.log("You are schure you want to vote for Candidate: "+candidateId+++" and the Party:"+partyId++)  
      return instance.vote(candidateId, 1, partyId,{ from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show(); 
      $("#content2").hide();
      $("#loader2").show(); 
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
