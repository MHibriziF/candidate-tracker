export function toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(toCamelCase);
    } else if (obj !== null && obj.constructor === Object) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
          toCamelCase(value)
        ])
      );
    }
    return obj;
  }
  