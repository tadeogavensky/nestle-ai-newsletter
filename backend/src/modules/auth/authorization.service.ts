import { Injectable } from '@nestjs/common';
import { Action } from './enum/actions';
import { RuleHandler } from './interfaces/rules';
import { NewsletterStatus } from './enum/status';
import { Role } from './enum/roles';

type User = {
  id: string,
  role: Role,
  area_id: string
}

type Newsletter = {
  created_by_user_id: string,
  state: NewsletterStatus,
  area_id: string
}

@Injectable()
export class AuthorizationService {
  private readonly permissions: Record<Action, RuleHandler> = {
    [Action.CREATE_NEWSLETTER]: () => true,
    [Action.USE_TEMPLATE]: () => true,
    [Action.GENERATE_AI_CONTENT]: () => true,
    [Action.EDIT_NEWSLETTER]: (user: User, res: Newsletter) => this.isOwner(user, res) && this.isEditable(res),
    [Action.SUBMIT_FOR_REVIEW]: (user: User, res: Newsletter) => this.isOwner(user, res) && this.isEditable(res),
    [Action.REVIEW_CHANGES]: (user: User, res: Newsletter) => this.isFunctionalAdmin(user) && this.isSameArea(user, res) && this.isUnderReview(res),
    [Action.APPROVE_NEWSLETTER]: (user: User, res: Newsletter) => this.isFunctionalAdmin(user) && this.isSameArea(user, res) && this.isUnderReview(res),
    [Action.REQUEST_CHANGES]: (user: User, res: Newsletter) => this.isFunctionalAdmin(user) && this.isSameArea(user, res) && this.isUnderReview(res),
    [Action.COMMENT_NEWSLETTER]: (user: User, res: Newsletter) => (this.isFunctionalAdmin(user) && this.isSameArea(user, res)) || this.isOwner(user, res),
    [Action.VIEW_TRAZABILITY]: (user: User) => this.isFunctionalAdmin(user),
    [Action.MANAGE_TEMPLATES]: (user: User) => this.isSuperAdmin(user),
    [Action.MANAGE_USERS]: (user: User) => this.isSuperAdmin(user),
    [Action.CONFIGURE_AI_PARAMS]: (user: User) => this.isSuperAdmin(user),
  };

  private isOwner(user: User, resource: Newsletter): boolean {
    return user.id === resource.created_by_user_id;
  }

  private isSameArea(user: User, resource: Newsletter): boolean {
    return user.area_id === resource.area_id;
  }

  private isSuperAdmin(user: User): boolean {
    return user.role === Role.SUPER_ADMIN;
  }

  private isFunctionalAdmin(user: User): boolean {
    return user.role === Role.ADMIN_FUNCIONAL;
  }

  private isEditable(resource: Newsletter): boolean {
    return [NewsletterStatus.DRAFT, NewsletterStatus.CHANGES_REQUESTED].includes(resource.state);
  }

  private isUnderReview(resource: Newsletter): boolean {
    return [NewsletterStatus.IN_REVIEW, NewsletterStatus.RESUBMITTED].includes(resource.state);
  }

  isAuthorized(user: User, action: Action, resource?: Newsletter): boolean {
    if (this.isSuperAdmin(user)) return true;

    const handler = this.permissions[action];
    return handler ? handler(user, resource) : false;
  }

  getNewslettersPermissions(user: User, newsletter: Newsletter) {
    return {
      canCreate: this.isAuthorized(user, Action.CREATE_NEWSLETTER, newsletter),
      canApprove: this.isAuthorized(user, Action.APPROVE_NEWSLETTER, newsletter),
      canEdit: this.isAuthorized(user, Action.EDIT_NEWSLETTER, newsletter),
      canSendToReview: this.isAuthorized(user, Action.SUBMIT_FOR_REVIEW, newsletter),
      canRequestChanges: this.isAuthorized(user, Action.REQUEST_CHANGES, newsletter),
      canComment: this.isAuthorized(user, Action.COMMENT_NEWSLETTER, newsletter),
      canViewTrazability: this.isAuthorized(user, Action.VIEW_TRAZABILITY, newsletter),
    }
  }

  getTemplatesPermissions(user: User) {
    return {
      canManage: this.isAuthorized(user, Action.MANAGE_TEMPLATES),
      canUse: this.isAuthorized(user, Action.USE_TEMPLATE),
      canViewTrazability: this.isAuthorized(user, Action.VIEW_TRAZABILITY),
    }
  }
}