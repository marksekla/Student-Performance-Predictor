import os
import sys

# os.path.abspath() isn't necessary here as __file__ already makes the path absolute, but it's a good safety measure to ensure that the path is absolute.
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
scripts_path = os.path.join(root_dir, 'scripts/Mitch')

# Add paths
sys.path.append(root_dir)
sys.path.append(scripts_path)
