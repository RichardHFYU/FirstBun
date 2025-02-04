export const layout = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agents Directory</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    ${getStyles()}
</head>
<body class="bg-light">
    ${getNavbar()}
    ${content}
    ${getFooter()}
    ${getScripts()}
</body>
</html>
` 