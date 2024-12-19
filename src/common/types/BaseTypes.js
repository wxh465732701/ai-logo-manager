// 基础类型定义
export const DataType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  ARRAY: 'array',
  NULL: 'null',
  UNDEFINED: 'undefined',
  FUNCTION: 'function',
  DATE: 'date'
};

// 类型检查工具
export class TypeChecker {
  static getType(value) {
    if (value === null) return DataType.NULL;
    if (value === undefined) return DataType.UNDEFINED;
    if (value instanceof Date) return DataType.DATE;
    if (Array.isArray(value)) return DataType.ARRAY;
    return typeof value;
  }

  static isString(value) {
    return typeof value === DataType.STRING;
  }

  static isNumber(value) {
    return typeof value === DataType.NUMBER && !isNaN(value);
  }

  static isBoolean(value) {
    return typeof value === DataType.BOOLEAN;
  }

  static isObject(value) {
    return value !== null && typeof value === DataType.OBJECT && !Array.isArray(value);
  }

  static isArray(value) {
    return Array.isArray(value);
  }

  static isFunction(value) {
    return typeof value === DataType.FUNCTION;
  }

  static isDate(value) {
    return value instanceof Date;
  }

  static isNull(value) {
    return value === null;
  }

  static isUndefined(value) {
    return value === undefined;
  }

  static isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }
}