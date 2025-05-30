import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function getCountryByIp(ip: string): Promise<string> {
    try {
        const response = await axios.get(`http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`);
        return response.data.country_name || 'Desconocido';
    } catch (error) {
        console.error('Error al obtener geolocalización:', error);
        return 'Desconocido';
    }
}