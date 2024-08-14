
/**
 * AppThemeBase provides the default theme values for the application.
 * Which is white theme.
 */
export class AppThemeBase {
    primaryMenuTextColor: string = "#0e0e0e";
    primaryColor: string = "#007bff";
    secondaryColor: string = "#6c757d";
    successColor: string = "#28a745";
    dangerColor: string = "#dc3545";
    warningColor: string = "#ffc107";
    infoColor: string = "#17a2b8";
    lightColor: string = "#f8f9fa";
    darkColor: string = "#343a40";
}

export var CurrentAppTheme = new AppThemeBase();
