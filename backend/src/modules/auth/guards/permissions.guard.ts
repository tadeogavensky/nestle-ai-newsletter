import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthorizationService } from "../services/authorization.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { PermissionCacheService } from "../services/permission-cache.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
        private authorizationService: AuthorizationService,
        private permissionCache: PermissionCacheService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const metadata = this.reflector.get<{ action: string; entity: string }>('permissions_metadata', context.getHandler());
        if (!metadata) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('No se encontró información del usuario');
        }

        const rolePermissions = await this.permissionCache.getPermissionsForRole(user.role);

        if (!rolePermissions.includes(metadata.action)) {
            throw new ForbiddenException({
                message: `Tu rol (${user.role}) no tiene el permiso: ${metadata.action}`,
                error: 'Permisos insuficientes',
                statusCode: 403
            });
        }
        
        let resource = null;
        
        const resourceId = request.params.id;

        if (resourceId && metadata.entity) {
            resource = await (this.prisma[metadata.entity] as any).findUnique({ where: { id: resourceId } });
            if (!resource) throw new NotFoundException(`Recurso ${metadata.entity} con ID ${resourceId} no encontrado`);
        }

        const isAuthorized = this.authorizationService.isAuthorized(user, metadata.action, resource);

        if(!isAuthorized) {
            throw new ForbiddenException({
                message: 'No tienes permisos para realizar esta acción',
                error: 'No se puede realizar esta acción',
                statusCode: 403
            });
        }

        return true;
    }
}