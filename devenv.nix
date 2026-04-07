{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  languages.typescript.enable = true;
  languages.javascript = {
    enable = true;
    corepack.enable = true;
    pnpm.enable = true;
    pnpm.install.enable
      = true; # Automatically install the correct version of pnpm based on the lockfile
  };

  # https://devenv.sh/processes/
  # processes.dev.exec = "${lib.getExe pkgs.watchexec} -n -- ls -la";
  
  scripts = {
    dev = {
      exec = "pnpm run dev";
    };
    build = {
      exec = "pnpm run build";
    };
    preview = {
      exec = "pnpm run preview";
    };
    sb = {
      exec = "pnpm run storybook";
    };
    lint = {
      exec = "pnpm run lint";
    };
    test = {
      exec = "pnpm run test";
    };
  };

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  enterTest = ''
    pnpm run test
  '';

  # See full reference at https://devenv.sh/reference/options/
}
