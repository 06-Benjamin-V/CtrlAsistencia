@echo off
title Analizador SonarQube - CtrlAsistencia
echo ========================================
echo Analizando proyecto con SonarQube...
echo ========================================
echo.

:: Cargar variables del archivo .env
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="SONAR_HOST" set SONAR_HOST=%%b
    if "%%a"=="SONAR_PROJECT_KEY" set SONAR_PROJECT_KEY=%%b
    if "%%a"=="SONAR_TOKEN" set SONAR_TOKEN=%%b
)

echo Configuracion:
echo - Host: %SONAR_HOST%
echo - Project Key: %SONAR_PROJECT_KEY%
echo - Token: %SONAR_TOKEN%
echo.

echo Ejecutando Maven...
echo.

:: Ejecutar análisis con Maven + JaCoCo + SonarQube
mvn clean verify sonar:sonar ^
  -Dsonar.projectKey=%SONAR_PROJECT_KEY% ^
  -Dsonar.host.url=%SONAR_HOST% ^
  -Dsonar.login=%SONAR_TOKEN%

echo.
echo ========================================
echo Analisis completado.
echo Revisa los resultados en:
echo %SONAR_HOST%/dashboard?id=%SONAR_PROJECT_KEY%
echo ========================================
pause
