import getComic from '../utils/comic-vine.js'

export default async function addDetailsToEntries(key, collection){    
    const update = key.updateAndOption.update;
    const aiGeneratedDetails = key.issue;
    return await collection.updateOne(key.updateAndOption.filter, update);

    const comicVineDetails = await getComic().init(aiGeneratedDetails.titleOfSeries, aiGeneratedDetails.seriesStartYear, aiGeneratedDetails.issueNumber);
    const labels = ['name', 'image'];
    if (Object.entries(update.$set).length > 1){
        const updateDetails = Object.entries(update['$set']).map(([key, value])=>{
            const label = key.split('.')[6];
            if (labels.includes(label)){
                return [key, comicVineDetails[label]];
            }
            return [key, value];
        });
        
        return await collection.updateOne(key.updateAndOption.filter, {$set: Object.fromEntries(updateDetails)});
    }
    else{
        const updateKey = Object.keys(update.$set)[0]
        update.$set[updateKey].name = comicVineDetails.name
        update.$set[updateKey].image = comicVineDetails.image 
    }     
}