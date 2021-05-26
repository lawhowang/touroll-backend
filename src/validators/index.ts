import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDateGreaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateStringGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${validationArguments.property} must be greater than ${validationArguments.constraints[0]}`;
        },
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value > relatedValue
        },
      },
    });
  };
}

export function IsDateGreaterThanToday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateStringGreaterThanToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${validationArguments.property} must be greater than today`;
        },
        validate(value: Date, args: ValidationArguments) {
          const today = new Date()
          return value > today;
        },
      },
    });
  };
}