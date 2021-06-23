namespace App {
  //class for standardizing projects obj
  export enum ProjectStatus {
    Active,
    Finished
  }

  export class Project {
    //shortcut for assigning parameters to the constructor(public "name": type), that become property of a class later
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public numberOfPeople: number,
      public status: ProjectStatus
    ) { }
  }
}