# Generated by Django 5.1.2 on 2024-12-06 19:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_alter_code_code_alter_persona_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('type', models.CharField(max_length=250)),
                ('age_group', models.CharField(max_length=250)),
                ('date_start', models.DateField()),
                ('date_end', models.DateField()),
                ('verify', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddField(
            model_name='organization',
            name='admin',
            field=models.BooleanField(default=False),
        ),
    ]
