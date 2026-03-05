<?php
$file = 'd:\Proyectos\DemoZ01\Sql\25-02-2026\kaizen_diesel.sql';
$content = file_get_contents($file);

// Find the block for "Table structure for menus"
$pattern = '/-- Table structure for menus.*?-- Records of menus\s*(.*?)(?:-- Table structure|CREATE TABLE|\Z)/s';
if (preg_match($pattern, $content, $matches)) {
    echo $matches[1];
} else {
    echo "No menus records found.\n";
}
