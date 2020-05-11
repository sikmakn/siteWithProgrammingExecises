const {achievement} = require('../models/achievement');
const {mongooseUpdateParams} = require('../../options');
const mongoose = require('mongoose');
const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'achievements',
});
const stream = require('stream');

async function create({file, conditions, description, name}) {
    const fileId = mongoose.Types.ObjectId();
    const bufferStream = createAchievementFile({file, fileId});
    return new Promise(resolve => {
        bufferStream.on('finish', () =>
            resolve(createAchievement({name, fileId, conditions, description})));
    });
}

async function createAchievementFile({file, fileId}) {
    const {buffer, originalname, mimetype} = file;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(buffer));
    const uploadStream = bucket.openUploadStreamWithId(fileId, originalname, {contentType: mimetype});
    bufferStream.pipe(uploadStream);
    return bufferStream;
}

async function createAchievement({name, fileId, conditions, description}) {
    const newAchievementModel = new achievement({
        name,
        fileId,
        conditions,
        description,
    });
    return await newAchievementModel.save();
}

async function updateAchievementFile({fileId, file}) {//todo check
    return new Promise(resolve => {
        bucket.delete(fileId, error => {
            if (error) throw error;
            const bufferStream = createAchievementFile({file, fileId});
            bufferStream.on('finish', () => resolve());
        });
    });
}

async function findAchievementFile(fileId) {
    const [fileInfo] = await bucket.find({_id: mongoose.Types.ObjectId(fileId)}).toArray();
    const downloadStream = bucket.openDownloadStreamByName(fileInfo.filename);
    const chunks = [];
    downloadStream.on('data', ch => chunks.push(ch));
    return new Promise(resolve =>
        downloadStream.on('close', () => {
            fileInfo.buffer = Buffer.concat(chunks);
            resolve(fileInfo);
        })
    );
}

async function findAchievements({achievementFotFind, count, sort = {number: 1}, skip = 0}) {//todo check
    const find = achievement.find(achievementFotFind).select('+conditions').sort(sort);
    if (count !== undefined)
        find.limit(skip + count);
    return await find;
}


async function addConditions({id, conditions}) {//todo check
    return await achievement.findByIdAndUpdate(id,
        {$push: {'conditions': conditions}},
        {
            upsert: true,
            ...mongooseUpdateParams
        });
}

async function deleteConditions({id, conditions}) {//todo check
    return await achievement.findOneAndUpdate(id,
        {$pull: {'conditions': conditions}},
        mongooseUpdateParams);
}

async function updateAchievement({id, name, conditions, description}) {
    return await achievement.findByIdAndUpdate(id, {name, conditions, description}, mongooseUpdateParams);
}

async function findById(id) {
    return await achievement.findById(id).select('+conditions');
}

module.exports = {
    create,
    findById,
    addConditions,
    findAchievements,
    findAchievementFile,
    deleteConditions,
    updateAchievement,
    updateAchievementFile,
};