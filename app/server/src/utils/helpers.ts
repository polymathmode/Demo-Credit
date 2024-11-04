import axios from 'axios';
import dotenv from "dotenv"


 dotenv.config()


const KARMA_API_URL = process.env.KARMA_API_URL;
const KARMA_API_KEY = process.env.KARMA_API_KEY;

interface KarmaLookupResponse {
  status: string;
  message: string;
  data?: {
    karma_identity: string;
    amount_in_contention: string;
    reason: string | null;
    default_date: string;
    karma_type: {
      karma: string;
    };
    karma_identity_type: {
      identity_type: string;
    };
    reporting_entity: {
      name: string;
      email: string;
    };
  };
  meta?: {
    cost: number;
    balance: number;
  };
}

export async function checkKarmaBlacklist(identity: string): Promise<boolean> {
  try {
    const url = `${KARMA_API_URL}/${identity}`;
    const response = await axios.get<KarmaLookupResponse>(url, {
      headers: {
        Authorization: `Bearer ${KARMA_API_KEY}`,
      },
    });
    return true; // User is blacklisted if the response is successful
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // 404 means user is not found, hence not blacklisted
      return false;
    }
    console.error('Error fetching Karma blacklist status:', error);
    throw new Error('Unable to verify user blacklist status');
  }
}
