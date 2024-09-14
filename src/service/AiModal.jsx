/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "{\n  \"id\": 1,\n  \"name\": \"Table 1\",\n  \"data\": [\n    {\n      \"fieldName\": \"id\",\n      \"columnName\": \"id\",\n      \"dataType\": \"VARCHAR\",\n      \"length\": 36,\n      \"partition\": \"Partition\",\n      \"remarks\": \"Customer ID for logged in users. Guest ID (is_guest = true) for guest users (i.e. not user without login)\"\n    },\n    {\n      \"fieldName\": \"email\",\n      \"columnName\": \"email\",\n      \"dataType\": \"VARCHAR\",\n      \"length\": 256,\n      \"partition\": \"no\",\n      \"remarks\": \"User email id\"\n    },\n    {\n      \"fieldName\": \"phone\",\n      \"columnName\": \"phone\",\n      \"dataType\": \"NUMERIC\",\n      \"length\": 16,\n      \"partition\": \"no\",\n      \"remarks\": \"User phone\"\n    },\n    {\n      \"fieldName\": \"isGuest\",\n      \"columnName\": \"is_guest\",\n      \"dataType\": \"BOOLEAN\",\n      \"length\": \"NA\",\n      \"partition\": \"Partition\",\n      \"remarks\": \"To differenciate guest user with logged in user\"\n    },\n    {\n      \"fieldName\": \"createdAt\",\n      \"columnName\": \"created_at\",\n      \"dataType\": \"TIMESTSAMP\",\n      \"length\": \"NA\",\n      \"partition\": \"no\",\n      \"remarks\": \"Record created timestamp\"\n    },\n    {\n      \"fieldName\": \"modifiedAt\",\n      \"columnName\": \"modified_at\",\n      \"dataType\": \"TIMESTSAMP\",\n      \"length\": \"NA\",\n      \"partition\": \"no\",\n      \"remarks\": \"Record modified timestamp\"\n    }\n  ]\n} \n\nnow based on the given table i need to answer the following question and generate the SQL query for the same question also do not give me anything other than SQL query i just want error free clean SQL query in string format and make sure it should be very accurate considering whatever the question i'm giving make it as simple as possible and also very accurate and clean considering handling database request and don't generate anything else than query \n\nquestion is: generate email and id for those data which is modified after creation" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```sql\nSELECT email, id FROM Table1 WHERE modified_at > created_at;\n```" },
            ],
        },
    ],
});