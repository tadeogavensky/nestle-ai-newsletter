import { AuthorizationService } from "../../src/modules/auth/authorization.service";
import { Role } from "../../src/modules/auth/enum/roles";
import { NewsletterStatus } from "../../src/modules/auth/enum/status";

const generalUser = { id: 'U1', role: Role.USUARIO_GENERAL, area_id: 'MARKETING' };
const funcAdmin = { id: 'A1', role: Role.ADMIN_FUNCIONAL, area_id: 'MARKETING' };
const superAdmin = { id: 'S1', role: Role.SUPER_ADMIN, area_id: 'OTRA' };

describe('Permisos de usuarios:', () => {
    let authService: AuthorizationService;

    beforeEach(() => {
        authService = new AuthorizationService();
    });

    describe('Permisos de newsletters', () => {

        test('Debe devolver el paquete completo para un Usuario General (Autor)', () => {
            const newsletter = { created_by_user_id: 'U1', state: NewsletterStatus.DRAFT, area_id: 'RRHH' };
            const permissions = authService.getNewslettersPermissions(generalUser, newsletter);

            expect(permissions).toMatchObject({
                canEdit: true,
                canSendToReview: true,
                canApprove: false,        // Regla: no puede auto-aprobarse
                canRequestChanges: false,
                canComment: true          // El autor puede comentar su propio trabajo
            });
        });

        test('Debe permitir aprobar solo al Admin Funcional del área correcta', () => {
            const newsletter = { created_by_user_id: 'U1', state: NewsletterStatus.IN_REVIEW, area_id: 'MARKETING' };

            const permissions = authService.getNewslettersPermissions(funcAdmin, newsletter);

            expect(permissions.canApprove).toBe(true);
            expect(permissions.canEdit).toBe(false); // No es el autor, no edita
        });

        test('Debe devolver el paquete completo para un Admin Funcional', () => {
            const newsletter = { created_by_user_id: 'U2', state: NewsletterStatus.IN_REVIEW, area_id: 'MARKETING' };
            const permissions = authService.getNewslettersPermissions(funcAdmin, newsletter);

            expect(permissions).toMatchObject({
                canEdit: false,           // El revisor no edita el contenido directo
                canApprove: true,
                canRequestChanges: true,
                canComment: true,
                canViewTrazability: true
            });
        });

        test('Debe devolver todo en true para el Super Admin', () => {
            const newsletter = { created_by_user_id: 'U1', state: NewsletterStatus.IN_REVIEW, area_id: 'OTRA' };
            const permissions = authService.getNewslettersPermissions(superAdmin, newsletter);

            expect(permissions.canApprove).toBe(true);
            expect(permissions.canEdit).toBe(true);
        });
    });


    // moverlos a donde corresponda
    describe('Permisos de templates', () => {
        test('Debe denegar gestión a usuarios no administrativos', () => {
            const permissions = authService.getTemplatesPermissions(generalUser);

            expect(permissions.canManage).toBe(false);
            expect(permissions.canUse).toBe(true);
            expect(permissions.canViewTrazability).toBe(false);
        });

        test('Debe permitir trazabilidad al Administrador Funcional', () => {
            const permissions = authService.getTemplatesPermissions(funcAdmin);

            expect(permissions.canViewTrazability).toBe(true);
            expect(permissions.canManage).toBe(false); // Sigue sin ser Super Admin
        });

        test('Debe permitir todo al Super Admin', () => {
            const permissions = authService.getTemplatesPermissions(superAdmin);

            expect(permissions.canManage).toBe(true);
            expect(permissions.canUse).toBe(true);
            expect(permissions.canViewTrazability).toBe(true);
        });
    });
});