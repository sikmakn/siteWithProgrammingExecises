// const userAchievementRepository = require('../../../db/repositories/userAchievementRepository');
// jest.mock('../../../db/repositories/userAchievementRepository');
//
// const exerciseResultService = require('../../../services/exerciseResultService');
// jest.mock('../../../services/exerciseResultService');
//
// const userAchievementService = require('../../../services/userAchievementService');
//
//
// describe('addByConditions function', () => {
//     let achievementId;
//     let conditions;
//     let achievementFindResult;
//     let userResults;
//     let groupResult;
//     let exerciseResultsByTheme;
//
//     beforeEach(() => {
//         achievementId = 'achievementId';
//         conditions = [];
//
//         userResults = [];
//         exerciseResultService.findByUsername.mockReturnValue(userResults);
//
//         groupResult = [{username: 'username', count: 5}];
//         exerciseResultService.groupByUsername.mockReturnValue(groupResult);
//
//         exerciseResultsByTheme = [];
//         exerciseResultService.find.mockReturnValue(exerciseResultsByTheme);
//
//         achievementFindResult = {_doc: 'doc'};
//         userAchievementRepository.addAchievements.mockReturnValue(achievementFindResult);
//     });
//
//     test('userAchievementRepository.addAchievements should be called', async () => {
//         await userAchievementService.addByConditions(conditions, achievementId);
//         expect(userAchievementRepository.addAchievements).toBeCalled();
//     });
//
//     test('should throw error', () => {
//         const error = new Error('not group');
//         exerciseResultService.groupByUsername.mockReturnValue(Promise.reject(error));
//         expect(userAchievementService.addByConditions(conditions, achievementId)).rejects.toThrowError();
//     });
//
//     test('return Truthy', async () => {
//         const result = await userAchievementService.addByConditions(conditions, achievementId);
//         expect(result).toBeDefined();
//         expect(result).toBeTruthy();
//         expect(result).not.toBeNull();
//         expect(result).not.toBeUndefined();
//     });
//
//     test('exerciseAchievements work', async () => {
//         conditions = [{exerciseId: '1'}, {exerciseId: '2'}];
//
//         groupResult = [{username: 'username1', count: 1}, {username: 'username2', count: 2}];
//         exerciseResultService.groupByUsername.mockReturnValue(groupResult);
//
//         const results = [];
//         userAchievementRepository.addAchievements.mockImplementation(d => results.push(d));
//
//         await userAchievementService.addByConditions(conditions, achievementId);
//         expect(results.length).toBe(1);
//         expect(results[0]).toEqual({username: 'username2', achievementIds: [achievementId]});
//     });
//
//     test('themeAchievements work', async () => {
//         conditions = [{themeId: '1'}, {themeId: '2'}];
//
//         const results = [];
//         userAchievementRepository.addAchievements.mockImplementation(d => results.push(d));
//
//         await userAchievementService.addByConditions(conditions, achievementId);
//         expect(results.length).toBe(1);
//         expect(results[0]).toEqual({username: 'username2', achievementIds: [achievementId]})
//     });
// });