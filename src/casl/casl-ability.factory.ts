import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Activity } from "src/activities/entities/activity.entity";
import { Tour } from "src/tours/entities/tour.entity";
import { User } from "src/users/entities/user.entity";
import { Action } from "./action.enum";

type Subjects = InferSubjects<typeof Tour | typeof User | any> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    can(Action.Read, 'all'); // read-only access to everything

    can(Action.Manage, Tour, { organizerId: user?.id }); // manage access to organizer

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
    });
  }
}