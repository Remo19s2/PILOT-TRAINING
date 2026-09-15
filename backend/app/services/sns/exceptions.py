class SnsIntegrationError(Exception):
    """Base error for the configurable SNS boundary."""


class SnsUnavailableError(SnsIntegrationError):
    pass


class SnsResponseError(SnsIntegrationError):
    pass
