
import { sql } from '@vercel/postgres';

export async function getUsers() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , email
    , password_hash
    , nickname
    , age
    , gender
    , last_login_at
    , created_at
    , updated_at
    , deleted_at
 FROM users
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getUserLocations() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , user_id
    , latitude
    , longitude
    , address
    , is_current
 FROM user_locations
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getChatRooms() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , user_id
    , title
    , is_active
    , created_at
    , updated_at
    , deleted_at
 FROM chat_rooms
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getChatMessages() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , chat_room_id
    , message_type
    , content
    , created_at
 FROM chat_messages 
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getDiseases() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , name
    , description
 FROM diseases  
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getSymptoms() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , name
    , description
 FROM symptoms  
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getSymptomSynonyms() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , symptom_id
    , synonym
    , source
    , frequency
 FROM symptom_synonyms  
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getHospitals() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , name
    , address
    , latitude
    , longitude
    , type
    , department
    , phone
    , website
    , operating_hours
 FROM hospitals  
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getMedicalEquipmentCategories() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , name
    , description
 FROM medical_equipment_categories   
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getMedicalEquipmentSubcategories() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , name
    , description
 FROM medical_equipment_subcategories    
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getSymptomAnalysis() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , chat_message_id
    , predicted_disease_id
    , confidence_score
    , raw_bert_output
    , created_at
 FROM symptom_analysis     
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getBertReportSymptoms() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , symptom_analysis_id
    , symptom_id
    , confidence_score
 FROM bert_report_symptoms      
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function getHospitalRecommendations() {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , symptom_analysis_id
    , distance
    , distance
    , recommended_reason
    , recommendation_score
 FROM hospital_recommendations       
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

export async function learning_data () {
  try {
    //const client = await db.connect();
    const selectTable = await sql
`SELECT 
      id
    , original_text
    , verified
    , verification_date
    , verifier_id
 FROM learning_data        
`;
    return selectTable.rows;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}
