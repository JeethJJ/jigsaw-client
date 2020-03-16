const stringify = require("canonicalize-json").stringify;
const axios = require("axios");
const sha256 = require("sha256");
var Base64 = require('js-base64').Base64;

// const sampleKnowledgeID = "a7f0f8250de51bb26e07279a49999f04f23243031e5a38fa192998e2819fb02e"     // for testing purposes
// const knowledgeID = "a7f0f8250de51bb26e07279a49999f04f23243031e5a38fa192998e2819fb02e"     // for testing purposes

const GetKnowledgeURL = `https://jigsaw-server.herokuapp.com/api/article/get/`
const GetContributionsUrl = `https://jigsaw-server.herokuapp.com/api/article/getContributions/`;


async function retrieveKnowledgeFromJigsaw(knowledgeID) {
    try {
        //get knowledge data
        const res = await axios.get(GetKnowledgeURL + knowledgeID);
        if (res != null) {
            // console.log(res.data.knowledge)
            return res.data.knowledge

        }
        return null
    } catch (e) {
        return null
        console.log(e)
    }
}

async function retrieveContributionsFromJigsaw(knowledgeID) {
    try {
        //get knowledge data
        const res = await axios.get(GetContributionsUrl + knowledgeID);
        if (res != null) {
            // console.log(res.data.contributions)
            return res.data.contributions
        }
        return null
    } catch (e) {
        console.log(e)
        return null
    }
}


async function retrieveKnowledgeTxnHashFromStellar(id) {

}

async function retrieveContributionTxnHashFromStellar(id) {

}



async function proof(knowledgeID) {
    const knowledgeData = await retrieveKnowledgeFromJigsaw(knowledgeID)
    const knowledgeHashFromStellar = await retrieveKnowledgeTxnHashFromStellar(knowledgeID)

    if (knowledgeData != null && knowledgeHashFromStellar != null) {

        //get the data from jigsaw ready to compare
        //canonicalise
        const canonicalized = stringify(knowledgeData)
        //sha256 hash it
        const knowledgeHash = sha256(canonicalized)
        //compare it
        if (knowledgeHash == knowledgeHashFromStellar) {
            console.log("" + knowledgeHash)
            console.log("" + knowledgeHashFromStellar)
            console.log("Proof of Knowledge Existance Success!")
        }
    }


    const constributionData = await retrieveContributionsFromJigsaw(knowledgeID)

    constributionData.forEach(async (contribution) => {
        const contributionHashFromStellar = await retrieveContributionTxnHashFromStellar(contribution.id)

        if (contribution.data != null && contributionHashFromStellar != null) {

            //get the data from jigsaw ready to compare
            //canonicalise
            const canonicalized = stringify(contribution.data)
            //sha256 hash it
            const contributionHash = sha256(canonicalized)
            //compare it
            if (contributionHash == contributionHashFromStellar) {
                console.log("" + contributionHash)
                console.log("" + contributionHashFromStellar)
                console.log("Proof of Contribution Existance Success!")
            }


        }
    })
}


//execute
proof(knowledgeID)          // pass in the knowledge ID here
