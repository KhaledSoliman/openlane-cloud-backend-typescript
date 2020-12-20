import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    Model,
    Optional
} from "sequelize";
import { Job } from "./job";

interface RunAttributes {
    id: string;
    jobId: string;
    name: string;
    status: string;
    completedAt: Date | null;
}

interface RunCreationAttributes extends Optional<RunAttributes, "id" | "status" | "completedAt"> {
}

export class Run extends Model<RunAttributes, RunCreationAttributes>
    implements RunAttributes {
    public id!: string;
    public jobId!: string;
    public name!: string;
    public status!: string;
    public completedAt!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;


    public getJob!: BelongsToGetAssociationMixin<Job>;
    public createJob!: BelongsToCreateAssociationMixin<Job>;
    public setJob!: BelongsToSetAssociationMixin<Run, number>;

    public readonly job?: Job; // Note this is optional since it's only populated when explicitly requested in code

    public static associations: {
        job: Association<Run, Job>;
    };

    static associate(models) {
        models["run"].belongsTo(models["job"], {
            sourceKey: "jobId",
            foreignKey: "id",
            as: "job",
        });
    }
}

export function RunModel(sequelize, DataTypes) {
    Run.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            jobId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: new DataTypes.STRING(128),
                allowNull: false,
                unique: true
            },
            status: {
                type: DataTypes.ENUM(
                    "running",
                    "running-synthesis",
                    "running-floorplan",
                    "running-placement",
                    "running-cts",
                    "running-routing",
                    "running-lvs",
                    "running-magic",
                    "completed",
                    "stopping",
                    "stopped",
                    "failed"
                ),
                defaultValue: "running"
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            }
        },
        {
            sequelize,
            tableName: "runs",
        }
    );
    return Run;
}
