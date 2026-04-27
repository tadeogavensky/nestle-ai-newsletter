import { AuthorizationService } from "../../src/modules/auth/authorization.service";
import { Action } from "../../src/modules/auth/enum/actions";
import { Role } from "../../src/modules/auth/enum/roles";
import { NewsletterStatus } from "../../src/modules/auth/enum/status";

const superAdmin = { id: '1', role: Role.SUPER_ADMIN, area_id: 'A' };
const functionalAdminAreaA = { id: '2', role: Role.ADMIN_FUNCIONAL, area_id: 'A' };
const generalUser = { id: '3', role: Role.USUARIO_GENERAL, area_id: 'A' };

const draftNewsletterOwn = { created_by_user_id: '3', state: NewsletterStatus.DRAFT, area_id: 'A' };
const inReviewNewsletterOwn = { created_by_user_id: '3', state: NewsletterStatus.IN_REVIEW, area_id: 'A' };
const draftNewsletterOther = { created_by_user_id: '4', state: NewsletterStatus.DRAFT, area_id: 'A' };
const inReviewNewsletterAreaB = { created_by_user_id: '4', state: NewsletterStatus.IN_REVIEW, area_id: 'B' };

describe('AuthService', () => {
    let authService: AuthorizationService;
  
    beforeEach(() => {
      authService = new AuthorizationService();
    });

    describe('RBAC: Super Admin', () => {
        test('Debe permitir gestiones de configuración de sistema y usuarios', () => {
            expect(authService.isAuthorized(superAdmin, Action.MANAGE_TEMPLATES)).toBe(true);
            expect(authService.isAuthorized(superAdmin, Action.MANAGE_USERS)).toBe(true);
            expect(authService.isAuthorized(superAdmin, Action.CONFIGURE_AI_PARAMS)).toBe(true);
        });

        test('Debe tener acceso completo a cualquier recurso sin importar autoría o área', () => {
            expect(authService.isAuthorized(superAdmin, Action.EDIT_NEWSLETTER, draftNewsletterOther)).toBe(true);
            expect(authService.isAuthorized(superAdmin, Action.APPROVE_NEWSLETTER, inReviewNewsletterAreaB)).toBe(true);
        });
    });

    describe('RBAC : Usuario General', () => {
        test('Debe permitir acciones de creación y uso de herramientas utilitarias', () => {
            expect(authService.isAuthorized(generalUser, Action.CREATE_NEWSLETTER)).toBe(true);
            expect(authService.isAuthorized(generalUser, Action.USE_TEMPLATE)).toBe(true);
            expect(authService.isAuthorized(generalUser, Action.GENERATE_AI_CONTENT)).toBe(true);
        });

        test('Debe PERMITIR editar y enviar a revisión si es el autor y el estado es DRAFT', () => {
            expect(authService.isAuthorized(generalUser, Action.EDIT_NEWSLETTER, draftNewsletterOwn)).toBe(true);
            expect(authService.isAuthorized(generalUser, Action.SUBMIT_FOR_REVIEW, draftNewsletterOwn)).toBe(true);
        });

        test('Debe DENEGAR editar o enviar a revisión si NO es el autor', () => {
            expect(authService.isAuthorized(generalUser, Action.EDIT_NEWSLETTER, draftNewsletterOther)).toBe(false);
            expect(authService.isAuthorized(generalUser, Action.SUBMIT_FOR_REVIEW, draftNewsletterOther)).toBe(false);
        });

        test('Debe DENEGAR editar si el newsletter ya está en revisión o aprobado', () => {
            expect(authService.isAuthorized(generalUser, Action.EDIT_NEWSLETTER, inReviewNewsletterOwn)).toBe(false);
        });

        test('Debe DENEGAR la aprobación de sus propios contenidos', () => {
            expect(authService.isAuthorized(generalUser, Action.APPROVE_NEWSLETTER, inReviewNewsletterOwn)).toBe(false);
        });

        test('Debe DENEGAR acceso a configuraciones de sistema', () => {
            expect(authService.isAuthorized(generalUser, Action.CONFIGURE_AI_PARAMS)).toBe(false);
            expect(authService.isAuthorized(generalUser, Action.MANAGE_USERS)).toBe(false);
            expect(authService.isAuthorized(generalUser, Action.MANAGE_TEMPLATES)).toBe(false);
        });
    });

    describe('RBAC: Admin Funcional', () => {
        test('Debe PERMITIR aprobar o solicitar cambios si el newsletter es de SU ÁREA y está IN_REVIEW', () => {
            expect(authService.isAuthorized(functionalAdminAreaA, Action.APPROVE_NEWSLETTER, inReviewNewsletterOwn)).toBe(true);
            expect(authService.isAuthorized(functionalAdminAreaA, Action.REQUEST_CHANGES, inReviewNewsletterOwn)).toBe(true);
        });

        test('Debe PERMITIR comentar y ver trazabilidad en newsletters de su área', () => {
            expect(authService.isAuthorized(functionalAdminAreaA, Action.COMMENT_NEWSLETTER, draftNewsletterOwn)).toBe(true);
            expect(authService.isAuthorized(functionalAdminAreaA, Action.VIEW_TRAZABILITY, draftNewsletterOwn)).toBe(true);
        });

        test('Debe DENEGAR aprobar si el newsletter pertenece a OTRA ÁREA', () => {
            expect(authService.isAuthorized(functionalAdminAreaA, Action.APPROVE_NEWSLETTER, inReviewNewsletterAreaB)).toBe(false);
        });

        test('Debe DENEGAR aprobar si el newsletter está en estado DRAFT (Aún no enviado a revisión)', () => {
            expect(authService.isAuthorized(functionalAdminAreaA, Action.APPROVE_NEWSLETTER, draftNewsletterOwn)).toBe(false);
        });

        test('Debe DENEGAR gestiones de configuración del sistema (solo para Super Admin)', () => {
            expect(authService.isAuthorized(functionalAdminAreaA, Action.MANAGE_TEMPLATES)).toBe(false);
            expect(authService.isAuthorized(functionalAdminAreaA, Action.MANAGE_USERS)).toBe(false);
            expect(authService.isAuthorized(functionalAdminAreaA, Action.CONFIGURE_AI_PARAMS)).toBe(false);
        });
    });
});