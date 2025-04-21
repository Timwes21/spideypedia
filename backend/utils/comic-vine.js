import 'dotenv/config';

const apiKey = process.env.COMIC_API;
const BASE_URL = 'https://comicvine.gamespot.com/api/';
const USER_AGENT = 'spideypedia'; 


export default function getComic(){
    async function getVolumeId(volumeName, startYear) {
        const res = await fetch(`${BASE_URL}search/?api_key=${apiKey}&format=json&resources=volume&query=${encodeURIComponent(volumeName)}`, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        const data = await res.json();
        const match = data.results.find(v => v.start_year === startYear);
        return match ? match.id : null;
    }

    async function getIssue(volumeId, issueNumber) {
        const res = await fetch(`${BASE_URL}issues/?api_key=${apiKey}&format=json&filter=volume:${volumeId},issue_number:${issueNumber}`, {
            headers: {
            'User-Agent': USER_AGENT
            }
        });
        const data = await res.json();
        return data.results[0];
    }

    async function main(volumeName, startYear, issueNumber) {
        
        const volumeId = await getVolumeId(volumeName, startYear);
        const issue = await getIssue(volumeId, issueNumber);
        
        
        const criteria = ["name", "image"];
        try{
            const res = Object.fromEntries(Object.entries(issue).filter(([key, value])=>criteria.includes(key)));
            return res
        }
        catch{
            return {};    
        }
        
    }
    return { "init": (volumeName, startYear, issueNumber)=> main(volumeName, startYear, issueNumber)}

}
