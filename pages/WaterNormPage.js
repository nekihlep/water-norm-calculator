class WaterNormPage {
    constructor(page) {
        this.page = page;
        this.citySelect = '#city';
        this.weightInput = '#weight';
        this.calculateBtn = '#calculateBtn';
        this.resultDiv = '#result';
        this.errorDiv = '#error';
    }

    async navigate() {
        await this.page.goto('http://127.0.0.1:8000');
        // Ждем загрузки страницы и появления элементов
        await this.page.waitForSelector(this.citySelect, { timeout: 10000 });
        await this.page.waitForSelector(this.weightInput);
        await this.page.waitForSelector(this.calculateBtn);
    }

    async selectCity(cityName) {
        // Ждем что select загрузился и в нем есть опции
        await this.page.waitForSelector(this.citySelect);
        await this.page.waitForTimeout(500); // Небольшая задержка для загрузки городов
        await this.page.selectOption(this.citySelect, cityName);
    }

    async setWeight(weight) {
        await this.page.waitForSelector(this.weightInput);
        await this.page.fill(this.weightInput, '');
        await this.page.fill(this.weightInput, String(weight));
    }

    async clickCalculate() {
        await this.page.waitForSelector(this.calculateBtn);
        await this.page.click(this.calculateBtn);
    }

    async getSuccessMessage() {
        await this.page.waitForSelector(this.resultDiv, { state: 'visible', timeout: 10000 });
        const text = await this.page.locator(this.resultDiv).textContent();
        return text;
    }

    async getErrorMessage() {
        await this.page.waitForSelector(this.errorDiv, { state: 'visible', timeout: 10000 });
        const text = await this.page.locator(this.errorDiv).textContent();
        return text;
    }
}

module.exports = WaterNormPage;