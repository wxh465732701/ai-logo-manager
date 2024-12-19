/**
 * 名称生成器
 * 可以生成指定长度的随机名称，包含大小写字母和数字
 */
class NameGenerator {
  // 字符集定义
  static LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  static UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static NUMBERS = '0123456789';

  // 用于记录已生成的名称
  static generatedNames = new Set();

  /**
   * 生成加密安全的随机数
   * @param {number} min - 最小值（包含）
   * @param {number} max - 最大值（不包含）
   * @returns {number} 随机数
   */
  static getSecureRandom(min, max) {
    const range = max - min;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxNum = Math.pow(256, bytesNeeded);
    const array = new Uint8Array(bytesNeeded);

    while (true) {
      crypto.getRandomValues(array);
      let val = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        val = (val << 8) + array[i];
      }
      if (val < maxNum - (maxNum % range)) {
        return min + (val % range);
      }
    }
  }

  /**
   * 生成随机名称
   * @param {number} length - 名称长度
   * @param {Object} options - 配置选项
   * @param {boolean} options.includeLowercase - 是否包含小写字母，默认 true
   * @param {boolean} options.includeUppercase - 是否包含大写字母，默认 true
   * @param {boolean} options.includeNumbers - 是否包含数字，默认 true
   * @param {boolean} options.unique - 是否确保唯一性，默认 false
   * @param {number} options.maxAttempts - 尝试生成唯一名称的最大次数，默认 100
   * @returns {string} 生成的随机名称
   */
  static generate(length, options = {}) {
    // 参数验证
    if (!Number.isInteger(length) || length <= 0) {
      throw new Error('Length must be a positive integer');
    }

    // 默认选项
    const defaultOptions = {
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      unique: false,
      maxAttempts: 100
    };

    // 合并选项
    const finalOptions = { ...defaultOptions, ...options };

    // 构建字符集
    let charset = '';
    if (finalOptions.includeLowercase) charset += NameGenerator.LOWERCASE_LETTERS;
    if (finalOptions.includeUppercase) charset += NameGenerator.UPPERCASE_LETTERS;
    if (finalOptions.includeNumbers) charset += NameGenerator.NUMBERS;

    // 验证字符集
    if (charset.length === 0) {
      throw new Error('At least one character type must be included');
    }

    // 计算可能的组合数
    const possibleCombinations = Math.pow(charset.length, length);
    if (finalOptions.unique && NameGenerator.generatedNames.size >= possibleCombinations) {
      throw new Error('All possible combinations have been exhausted');
    }

    // 生成随机名称
    let attempts = 0;
    while (attempts < finalOptions.maxAttempts) {
      let result = '';
      // 确保每种类型的字符至少出现一次
      let remainingLength = length;
      
      // 如果需要包含特定类型的字符，先添加一个
      if (finalOptions.includeLowercase && remainingLength > 0) {
        result += NameGenerator.LOWERCASE_LETTERS[this.getSecureRandom(0, NameGenerator.LOWERCASE_LETTERS.length)];
        remainingLength--;
      }
      if (finalOptions.includeUppercase && remainingLength > 0) {
        result += NameGenerator.UPPERCASE_LETTERS[this.getSecureRandom(0, NameGenerator.UPPERCASE_LETTERS.length)];
        remainingLength--;
      }
      if (finalOptions.includeNumbers && remainingLength > 0) {
        result += NameGenerator.NUMBERS[this.getSecureRandom(0, NameGenerator.NUMBERS.length)];
        remainingLength--;
      }

      // 填充剩余长度
      for (let i = 0; i < remainingLength; i++) {
        const randomIndex = this.getSecureRandom(0, charset.length);
        result += charset[randomIndex];
      }

      // 随机打乱字符顺序
      result = result.split('').sort(() => Math.random() - 0.5).join('');

      // 检查唯一性
      if (!finalOptions.unique || !NameGenerator.generatedNames.has(result)) {
        if (finalOptions.unique) {
          NameGenerator.generatedNames.add(result);
        }
        return result;
      }

      attempts++;
    }

    throw new Error('Failed to generate unique name after maximum attempts');
  }

  /**
   * 清除已生成的名称记录
   */
  static clearGeneratedNames() {
    NameGenerator.generatedNames.clear();
  }

  /**
   * 获取已生成的唯一名称数量
   * @returns {number} 唯一名称数量
   */
  static getGeneratedCount() {
    return NameGenerator.generatedNames.size;
  }

  /**
   * 生成只包含小写字母的随机名称
   * @param {number} length - 名称长度
   * @returns {string} 生成的随机名称
   */
  static generateLowercase(length) {
    return this.generate(length, {
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false
    });
  }

  /**
   * 生成只包含大写字母的随机名称
   * @param {number} length - 名称长度
   * @returns {string} 生成的随机名称
   */
  static generateUppercase(length) {
    return this.generate(length, {
      includeLowercase: false,
      includeUppercase: true,
      includeNumbers: false
    });
  }

  /**
   * 生成只包含数字的随机名称
   * @param {number} length - 名称长度
   * @returns {string} 生成的随机名称
   */
  static generateNumbers(length) {
    return this.generate(length, {
      includeLowercase: false,
      includeUppercase: false,
      includeNumbers: true
    });
  }

  /**
   * 生成包含字母（大小写）的随机名称
   * @param {number} length - 名称长度
   * @returns {string} 生成的随机名称
   */
  static generateLetters(length) {
    return this.generate(length, {
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: false
    });
  }

  /**
   * 生成包含字母（小写）和数字的随机名称
   * @param {number} length - 名称长度
   * @returns {string} 生成的随机名称
   */
  static generateLowercaseAndNumbers(length) {
    return this.generate(length, {
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: true
    });
  }

  /**
   * 生成包含字母（大写）和数字的随机名称
   * @param {number} length - 名称长度
   * @returns {string} 生成的随机名称
   */
  static generateUppercaseAndNumbers(length) {
    return this.generate(length, {
      includeLowercase: false,
      includeUppercase: true,
      includeNumbers: true
    });
  }
}

export default NameGenerator; 