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
            web_build_odin: {
                cmd: 'npm',
                args: [
                    'run',
                    'build-odin'
                ]
            },
            web_build_heimdall: {
                cmd: 'npm',
                args: [
                    'run',
                    'build-heimdall'
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
            odin: {
                options: {
                    bucket: '9cscan',
                    differential: true
                },
                files: [
                    {action: 'upload', cwd: 'dist', src: ['**'], expand: true}
                ]
            },
            heimdall: {
                options: {
                    bucket: '9cscan-planet1',
                    differential: true
                },
                files: [
                    {action: 'upload', cwd: 'dist', src: ['**'], expand: true}
                ]
            },
            stage: {
                options: {
                    bucket: 'stage.9cscan',
                    differential: true
                },
                files: [
                    {action: 'upload', cwd: 'dist', src: ['**'], expand: true}
                ]
            }
        }
    });

    grunt.registerTask('build', ['run:web_build']);
    grunt.registerTask('serve', ['run:web_serve']);
    grunt.registerTask('deploy-odin', ['run:web_build_odin', 'aws_s3:odin']);
    grunt.registerTask('deploy-heimdall', ['run:web_build_heimdall', 'aws_s3:heimdall']);
    grunt.registerTask('stage', ['run:web_stage', 'aws_s3:stage']);
};
