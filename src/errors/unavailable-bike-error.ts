export class UnavailableBikeError extends Error{
    public readonly name = 'UnavailableBikeError'

    constructor() {
        super('Bike Unavailable.')
    }
}