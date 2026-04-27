const { test, expect } = require('@playwright/test');
const WaterNormPage = require('../pages/WaterNormPage');

test.describe('Daily Water Norm Calculator', () => {
    let waterNormPage;

    test.beforeEach(async ({ page }) => {
        waterNormPage = new WaterNormPage(page);
        await waterNormPage.navigate();
    });

    test('Hot city (Сочи) - increased norm', async () => {
        await waterNormPage.selectCity('Сочи');
        await waterNormPage.setWeight('70');
        await waterNormPage.clickCalculate();
        const message = await waterNormPage.getSuccessMessage();
        expect(message).toContain('2.7');
    });

    test('Cold city (Мурманск) - decreased norm', async () => {
        await waterNormPage.selectCity('Мурманск');
        await waterNormPage.setWeight('70');
        await waterNormPage.clickCalculate();
        const message = await waterNormPage.getSuccessMessage();
        expect(message).toContain('1.9');
    });

    test('Standard city (Москва) - normal coefficient', async () => {
        await waterNormPage.selectCity('Москва');
        await waterNormPage.setWeight('70');
        await waterNormPage.clickCalculate();
        const message = await waterNormPage.getSuccessMessage();
        expect(message).toContain('2.1');
    });

    test('Negative weight - error', async () => {
        await waterNormPage.selectCity('Москва');
        await waterNormPage.setWeight('-50');
        await waterNormPage.clickCalculate();
        const error = await waterNormPage.getErrorMessage();
        expect(error).toContain('отрицательным');
    });

    test('Weight too low - error', async () => {
        await waterNormPage.selectCity('Москва');
        await waterNormPage.setWeight('1');
        await waterNormPage.clickCalculate();
        const error = await waterNormPage.getErrorMessage();
        expect(error).toContain('слишком мал');
    });

    test('Weight too high - error', async () => {
        await waterNormPage.selectCity('Москва');
        await waterNormPage.setWeight('800');
        await waterNormPage.clickCalculate();
        const error = await waterNormPage.getErrorMessage();
        expect(error).toContain('слишком велик');
    });
});