import { SetMetadata } from '@nestjs/common';

export const ALLOWS_GUEST_KEY = 'allowsGuest';

export const AllowGuest = () => SetMetadata(ALLOWS_GUEST_KEY, true);
