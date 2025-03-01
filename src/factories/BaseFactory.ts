export default class BaseFactory <DataType = unknown> {
  constructor(public data: Partial<DataType> = {}){}

  set(key: keyof DataType, value: unknown){
    this.data = {
      ...this.data,
      [key]: value,
    };

    return this;
  }
  
  delete(key: keyof DataType){
    this.data = {
      ...this.data,
      [key]: undefined
    };
    
    return this;
  }

  get(): DataType {
    return this.data as DataType;
  }
}