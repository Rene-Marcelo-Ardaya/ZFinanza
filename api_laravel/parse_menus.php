<?php
$file = 'd:\Proyectos\DemoZ01\Sql\25-02-2026\kaizen_diesel.sql';
$content = file_get_contents($file);

preg_match_all('/CREATE TABLE `([^`]+)`/i', $content, $matches);
$tables = $matches[1];

echo "Tables matching 'menu', 'pantalla', 'modulo', 'nav', 'opcion':\n";
foreach($tables as $table) {
    if(preg_match('/menu|pantalla|modulo|nav|opcion/i', $table)) {
        echo "- $table\n";
    }
}
