module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-aws-s3');
    let config = {}
    try {
        config = grunt.file.readJSON('.config')
    } catch(e) {
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        run: {
            web_build: {
                cmd: 'npm',
                args: [
                    'run',
                    'build'
                ]
            },
            web_stage: {
                cmd: 'npm',
                args: [
                    'run',
                    'stage'
                ]
            },
            web_serve: {
                cmd: 'npm',
                args: [
                    'run',
                    'serve'
                ]
            },
            sync_assets: {
                cmd: 'sh',
                args: ['./sync-assets.sh']
            },
            update_git_submodule: {
                cmd: 'git',
                args: [
                    'submodule', 'update', '--init', '--remote'
                ]
            }
        },
        aws: {
            AWSAccessKeyId: config.credentials.accessKeyId,
            AWSSecretKey: config.credentials.secretAccessKey
        },
        aws_s3: {
            options: {
                accessKeyId: config.credentials.accessKeyId,
                secretAccessKey: config.credentials.secretAccessKey,
                region: config.region,
                uploadConcurrency: 5,
                downloadConcurrency: 5
            },
            assets: {
                options: {
                    bucket: config.s3WebBucketName,
                    differential: true
                },
                files: [
                    {action: 'upload',
                        cwd: 'NineChronicles/nekoyume/Assets/AddressableAssets/TableCSV/Item',
                        src: ['*.csv'],
                        dest: 'NineChronicles/nekoyume/Assets/AddressableAssets/TableCSV/Item',
                        expand: true},
                    {action: 'upload',
                        cwd: 'NineChronicles/nekoyume/Assets/Resources/UI/Icons/Item',
                        src: ['*.png'],
                        dest: 'NineChronicles/nekoyume/Assets/Resources/UI/Icons/Item',
                        expand: true},
                    {action: 'upload',
                        cwd: 'NineChronicles/nekoyume/Assets/StreamingAssets/Localization',
                        src: ['*.csv'],
                        dest: 'NineChronicles/nekoyume/Assets/StreamingAssets/Localization',
                        expand: true}
                ]
            },
            web: {
                options: {
                    bucket: config.s3WebBucketName,
                    differential: true
                },
                files: [
                    {action: 'upload', cwd: 'dist', src: ['**'], expand: true}
                ]
            },
            stage: {
                options: {
                    bucket: config.s3StageWebBucketName,
                    differential: true
                },
                files: [
                    {action: 'upload', cwd: 'dist', src: ['**'], expand: true}
                ]
            }
        }
    });

    grunt.registerTask('build', ['run:update_git_submodule', 'run:sync_assets', 'run:web_build']);
    grunt.registerTask('serve', ['run:update_git_submodule', 'run:sync_assets', 'run:web_serve']);
    grunt.registerTask('deploy', ['run:update_git_submodule', 'run:sync_assets', 'run:web_build', 'aws_s3:web']);
    grunt.registerTask('stage', ['run:update_git_submodule', 'run:sync_assets', 'run:web_stage', 'aws_s3:stage']);
    grunt.registerTask('sync', ['run:sync_assets']);

    grunt.registerTask('upload-assets', ['run:update_git_submodule', 'aws_s3:assets']);
};
